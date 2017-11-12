import path from 'path'

import GLInstance from './gl'

import {
  createProgram,
  createShader,
} from '../../utils/shader'

import {
  readFile,
} from '../../utils/files'

const gl = GLInstance(document.getElementById('webgl-main-canvas'))
gl.fSetSize(500, 500).fClear()

Promise.all([
  readFile(path.resolve(__dirname, './vert.glsl'), 'utf8'),
  readFile(path.resolve(__dirname, './frag.glsl'), 'utf8'),
]).then(([vert, frag]) => {
  const vertexShader = createShader(gl, vert, gl.VERTEX_SHADER)
  const fragmentShader = createShader(gl, frag, gl.FRAGMENT_SHADER)
  const shaderProgram = createProgram(gl, vertexShader, fragmentShader, true)

  gl.useProgram(shaderProgram)
  const aPositionLoc = gl.getAttribLocation(shaderProgram, 'aPosition')
  const uPointSizeLoc = gl.getUniformLocation(shaderProgram, 'uPointSize')

  gl.useProgram(null)


  const arrayVerts = new Float32Array([0, 0, 0])
  const bufferVerts = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferVerts)
  gl.bufferData(gl.ARRAY_BUFFER, arrayVerts, gl.STATIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)


  gl.useProgram(shaderProgram)
  gl.uniform1f(uPointSizeLoc, 50.0)

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferVerts)

  gl.enableVertexAttribArray(aPositionLoc)
  gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  gl.drawArrays(gl.POINTS, 0, 1)
})

