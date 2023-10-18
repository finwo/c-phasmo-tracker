LIBS:=
SRC:=
BIN?=phasmo-tracker

SRC+=$(wildcard src/*.c)

INCLUDES:=

CPPFLAGS:=
CPPFLAGS+=`pkg-config --cflags --libs gtk+-3.0 webkit2gtk-4.0 libiowow` -lstdc++

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
