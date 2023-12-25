#include <sys/types.h>

#include "tidwall/buf.h"

const char * homedir();
ssize_t file_put_contents(const char *filename, const struct buf *data, int flags);
struct buf * file_get_contents(const char *filename);

#if defined(_WIN32) || defined(_WIN64)
char *dirname(const char *path);
#endif
