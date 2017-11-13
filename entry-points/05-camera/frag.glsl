#version 300 es
precision mediump float;

in lowp vec4 color;
out vec4 finalColor;

void main (void) {
  finalColor = color;
}