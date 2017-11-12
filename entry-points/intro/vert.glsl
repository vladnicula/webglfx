#version 300 es
precision mediump float;

in vec3 aPosition;

uniform float uPointSize;
uniform float uAngle;

out vec3 vertexColor;

void main(void) {  
  vertexColor = aPosition;
  gl_PointSize = uPointSize;
  gl_Position = vec4(
    cos(uAngle) * 0.3 + aPosition.x,
    sin(uAngle) * 0.3 + aPosition.y,
    aPosition.z,
    1.0
  );
}