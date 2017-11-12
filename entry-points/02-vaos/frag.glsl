#version 300 es
precision mediump float;

in vec3 vertexColor;

uniform float uPointSize;

out vec4 finalColor;

void main (void) {
  float color = (40.0 - uPointSize) / 20.0;
  finalColor = vec4(vertexColor + color * 0.2, 1.0);
}