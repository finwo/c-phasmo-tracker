#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#if defined(_WIN32) || defined(_WIN64)
#include <windows.h>
#else
#include <libgen.h>
#include <pwd.h>
#include <unistd.h>
#endif

#include "tidwall/buf.h"
#include "user-none/mkdirp.h"

const char * homedir() {
  const char *response;
#if defined(_WIN32) || defined(_WIN64)
  return getenv("USERPROFILE");
#else
  if ((response = getenv("HOME")) == NULL) {
    response = getpwuid(getuid())->pw_dir;
  }
  return response;
#endif
}

#if defined(_WIN32) || defined(_WIN64)
// Origin: https://stackoverflow.com/a/21229258
char *dirname(const char *path) {
  int maxsize  = strlen(path) + 256;
  char *dir = calloc(1, maxsize);
  _splitpath_s(path,
      NULL, 0,             // Don't need drive
      dir, maxsize,    // Just the directory
      NULL, 0,             // Don't need filename
      NULL, 0);
  return dir;
}
#endif


// Returns bytes written
ssize_t file_put_contents(const char *filename, const struct buf *data, int flags) {
  char *dir = NULL;
  char *dup = NULL;

  // flag 1 = create directory
  if (flags & 1) {
    dup = strdup(filename);
    dir = dirname(dup);
    free(dup);
    if (mkdirp(dir) == false) {
      perror("mkdirp");
      return -1;
    }
  }

  // Actualle open + write + close the file
  FILE *fd = fopen(filename, "w+");
  ssize_t written = 0;
  ssize_t check   = 0;
  int tries = 3;
  while((written < (data->len)) && ((tries--) >= 0)) {
    written += fwrite(
        data->data + written,
        1,
        data->len - written,
        fd
    );
    if (written < check) {
      fclose(fd);
      perror("fwrite");
      return -1;
    }
    check = written;
  }
  fclose(fd);

  return written;
}

struct buf * file_get_contents(const char *filename) {

  FILE *fd = fopen(filename, "r");
  if (!fd) {
    perror("fopen");
    return NULL;
  }

  char *intermediate = malloc(BUFSIZ);
  struct buf *output = calloc(1, sizeof(struct buf));
  size_t    read = 0;
  while(!feof(fd)) {
    read = fread(intermediate, 1, BUFSIZ, fd);
    buf_append(output, intermediate, read);
  }

  fclose(fd);
  free(intermediate);

  return output;
}
