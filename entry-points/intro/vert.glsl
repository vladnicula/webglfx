#version 300 es
precision mediump float;

in vec3 aPosition;

uniform float uPointSize;

out vec3 vertexColor;

void main(void) {  
  vertexColor = aPosition;
  gl_PointSize = uPointSize;
  gl_Position = vec4(aPosition, 1.0);
}