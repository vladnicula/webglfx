#version 300 es

in vec3 aPosition;
layout(location=4) in float aColor;


// uniform mat4 uPerspectiveMtx;
uniform mat4 uModelViewMtx;
// uniform mat4 uCameraMtx;
// uniform mat4 uMainTex;

uniform vec3 uColor[4];

out lowp vec4 color;

void main(void) {  
  color = vec4(uColor[ int(aColor) ], 1.0);

  gl_Position = uModelViewMtx * vec4(
    aPosition,
    1.0
  );
}