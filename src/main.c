#include <stdio.h>
#include <stdlib.h>
#include <stddef.h>
#include <string.h>

#ifdef _WIN32
#include "lockless/winpthreads.h"
#include <windows.h>
#else
#include <pthread.h>
#endif

#include "cesanta/mongoose.h"
#include "webview/webview.h"

typedef struct {
  int port;
} context_t;

#define UNUSED(x) (void)x

char * get_html(char *name) {
  if (!strcmp("control-ui", name)) {
    return
#include "../tool/control-ui/dist/index.bundled.h"
      ;
  }
  return "";
}

void wv_test(const char *seq, const char *req, void *arg);
static void handle_http(struct mg_connection *c, int ev, void *ev_data, void *fn_data);

void * thread_http(void * arg) {
  context_t *context = (context_t *)arg;
  struct mg_mgr *mgr = NULL;
  int myport = -1;
  int needed;
  char *url = NULL;

  for (;;) {

    // Restart http server if port changed
    if (myport != context->port) {
      if (mgr) { mg_mgr_free(mgr); }
      if (!mgr) { mgr = malloc(sizeof(struct mg_mgr)); }
      mg_mgr_init(mgr);

      // Build http://0.0.0.0:<port>
      if (url) free(url);
      needed = snprintf(NULL, 0, "http://0.0.0.0:%d", context->port);
      url = calloc(1, needed + 1);
      snprintf(url, needed + 1, "http://0.0.0.0:%d", context->port);

      // Start listening
      mg_http_listen(mgr, url, handle_http, NULL);
      myport = context->port;
    }

    // Handle connections etc
    mg_mgr_poll(mgr, 1000);
  }
  return NULL;
}

void * thread_window(void * arg) {
  webview_t w = webview_create(1, NULL);
  webview_set_title(w, "Basic Example");
  webview_set_size(w, 480, 320, WEBVIEW_HINT_NONE);
  webview_bind(w, "wv_test", wv_test, arg);
  webview_set_html(w, get_html("control-ui"));
  webview_run(w);
  webview_destroy(w);
  return NULL;
}

void wv_test(const char *seq, const char *req, void *arg) {
  context_t *context = (context_t *)arg;
  UNUSED(seq);
  UNUSED(req);
  UNUSED(context);
  printf("Bound fn was called!\nseq: %s\nreq: %s\n", seq, req);

  printf("Old port: %d\n", context->port);
  context->port++;
  printf("New port: %d\n", context->port);
}

static void handle_http(struct mg_connection *c, int ev, void *ev_data, void *fn_data) {
  if (ev == MG_EV_HTTP_MSG) {
    struct mg_http_message *hm = (struct mg_http_message *) ev_data;
    if (mg_http_match_uri(hm, "/api/hello")) {              // On /api/hello requests,
      mg_http_reply(c, 200, "", "{%m:%d}\n",
                    MG_ESC("status"), 1);                   // Send dynamic JSON response
    } else {                                                // For all other URIs,
      struct mg_http_serve_opts opts = {.root_dir = "."};   // Serve files
      mg_http_serve_dir(c, hm, &opts);                      // From root_dir
    }
  }
}

#ifdef _WIN32
int WINAPI WinMain(HINSTANCE hInst, HINSTANCE hPrevInst, LPSTR lpCmdLine,
                   int nCmdShow) {
  (void)hInst;
  (void)hPrevInst;
  (void)lpCmdLine;
  (void)nCmdShow;
#else
int main() {
#endif

  context_t context = {
    .port = 3000,
  };
  pthread_t threads[2];
  int i;

  i = pthread_create(&threads[0], NULL, thread_http  , &context);
  i = pthread_create(&threads[1], NULL, thread_window, &context);

  for(i = 0; i < 2 ; i++) {
    pthread_join(threads[i], NULL);
  }

  return 0;
}
