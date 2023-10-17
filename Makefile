LIBS:=
SRC:=
BIN?=phasmo-tracker

SRC+=$(wildcard src/*.c)

INCLUDES:=

override CFLAGS?=-Wall -s -O2

include lib/.dep/config.mk

OBJ:=$(SRC:.c=.o)
OBJ:=$(OBJ:.cc=.o)

override CFLAGS+=$(INCLUDES)

.PHONY: default
default: $(BIN)

$(OBJ): $(SRC)

$(BIN): $(OBJ)
	$(CC) $(LDFLAGS) -s $(OBJ) -o $@

.PHONY: clean
clean:
	rm -f $(BIN)
	rm -f $(OBJ)
