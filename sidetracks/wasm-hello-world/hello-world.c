#include <stdio.h>
#include <emscripten/emscripten.h>

int EMSCRIPTEN_KEEPALIVE addNumbers (int a, int b) {
  return a + b;
}