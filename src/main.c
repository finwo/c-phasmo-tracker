#include <stdio.h>
#include <stdlib.h>
#include <stddef.h>
#include <string.h>

#ifdef _WIN32
#include <windows.h>
#endif

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

void wv_test(const char *seq, const char *req, void *arg) {
  context_t *context = (context_t *)arg;

  UNUSED(seq);
  UNUSED(req);
  UNUSED(context);

  printf("Bound fn was called!\nseq: %s\nreq: %s\n", seq, req);
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

  webview_t w = webview_create(1, NULL);
  webview_set_title(w, "Basic Example");
  webview_set_size(w, 480, 320, WEBVIEW_HINT_NONE);

  webview_bind(w, "wv_test", wv_test, &context);

  webview_set_html(w, get_html("control-ui"));
  webview_run(w);
  webview_destroy(w);
  return 0;
}
