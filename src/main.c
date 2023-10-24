#include <stdio.h>
#include <stdlib.h>
#include <stddef.h>
#include <string.h>

#ifdef _WIN32
#include <windows.h>
#include <winsock2.h>
#endif

#ifdef __APLE__
#include <unistd.h>
#endif

#include "finwo/http-parser.h"
#include "finwo/http-server.h"
#include "pierreguillot/thread.h"
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

/* static void sleep_ms(long ms) { */
/* #if defined(__APPLE__) */
/*     usleep(ms * 1000); */
/* #elif defined(_WIN32) */
/*     Sleep(ms); */
/* #else */
/*     time_t sec = (int)(ms / 1000); */
/*     const long t = ms -(sec * 1000); */
/*     struct timespec req; */
/*     req.tv_sec = sec; */
/*     req.tv_nsec = t * 1000000L; */
/*     while(-1 == nanosleep(&req, &req)); */
/* #endif */
/* } */

void wv_test(const char *seq, const char *req, void *arg);

void onServing(char *addr, uint16_t port, void *udata) {
  printf("Serving at %s:%d\n", addr, port);
}

void route_404(struct http_server_reqdata *reqdata) {
  http_parser_header_set(reqdata->reqres->response, "Content-Type", "text/plain");
  reqdata->reqres->response->status     = 404;
  reqdata->reqres->response->body       = calloc(1, sizeof(struct buf));
  reqdata->reqres->response->body->data = strdup("not found\n");
  reqdata->reqres->response->body->len  = strlen(reqdata->reqres->response->body->data);
  http_server_response_send(reqdata, true);
  return;
}

void route_get_pizza(struct http_server_reqdata *reqdata) {
  http_parser_header_set(reqdata->reqres->response, "Content-Type", "text/plain");
  reqdata->reqres->response->body       = calloc(1, sizeof(struct buf));
  reqdata->reqres->response->body->data = strdup("calzone\n");
  reqdata->reqres->response->body->len  = strlen(reqdata->reqres->response->body->data);
  http_server_response_send(reqdata, true);
  return;
}

void thread_http(void * arg) {
  struct http_server_events evs = {
    .serving  = onServing,
    .close    = NULL,
    .notFound = route_404
  };

  http_server_route("GET", "/pizza", route_get_pizza);

/* #if defined(_WIN32) */
/*   {WORD wsa_version = MAKEWORD(2,2); */
/*     WSADATA wsa_data; */
/*     if (WSAStartup(wsa_version, &wsa_data)) { */
/*         fprintf(stderr, "WSAStartup failed\n"); */
/*         return 1; */
/*   }} */
/* #endif */

  http_server_main(&(const struct http_server_opts){
    .evs    = &evs,
    .addr   = "0.0.0.0",
    .port   = 8080,
  });

/* #if defined(_WIN32) */
/*   WSACleanup(); */
/* #endif */
}


void thread_window(void * arg) {
  webview_t w = webview_create(1, NULL);
  webview_set_title(w, "Basic Example");
  webview_set_size(w, 480, 320, WEBVIEW_HINT_NONE);
  webview_bind(w, "wv_test", wv_test, arg);
  webview_set_html(w, get_html("control-ui"));
  webview_run(w);
  webview_destroy(w);
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

/* static void handle_http(struct mg_connection *c, int ev, void *ev_data, void *fn_data) { */
/*   if (ev == MG_EV_HTTP_MSG) { */
/*     struct mg_http_message *hm = (struct mg_http_message *) ev_data; */
/*     if (mg_http_match_uri(hm, "/api/hello")) {              // On /api/hello requests, */
/*       mg_http_reply(c, 200, "", "{%m:%d}\n", */
/*                     MG_ESC("status"), 1);                   // Send dynamic JSON response */
/*     } else {                                                // For all other URIs, */
/*       struct mg_http_serve_opts opts = {.root_dir = "."};   // Serve files */
/*       mg_http_serve_dir(c, hm, &opts);                      // From root_dir */
/*     } */
/*   } */
/* } */

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
  thd_thread threads[2];
  int i;

  i = thd_thread_detach(&threads[0], thread_http  , &context);
  i = thd_thread_detach(&threads[1], thread_window, &context);

  for(i = 0; i < 2 ; i++) {
    thd_thread_join(&threads[i]);
  }

  return 0;
}
