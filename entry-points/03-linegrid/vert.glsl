#version 300 es

in vec3 aPosition;
layout(location=4) in float aColor;

uniform vec3 uColor[4];

out lowp vec4 color;

void main(void) {  
  color = vec4(uColor[ int(aColor) ], 1.0);

  gl_Position = vec4(
    aPosition,
    1.0
  );
}