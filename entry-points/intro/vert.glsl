#version 300 es

in vec3 aPosition;

uniform float uPointSize;

void main(void) {
  gl_PointSize = uPointSize;
  gl_Position = vec4(aPosition, 1.0);
}