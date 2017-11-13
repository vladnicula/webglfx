import { ATTR_POSITION_LOC } from '../../utils/constants'
import Modal from '../../utils/model'

export const createGridMesh = (gl, incAxis) => {
  const size = 1.8
  const div = 10
  const step = size / div
  const half = size / 2

  let p
  let arrayPos = 0
  const verts = new Float32Array((div + (incAxis ? 0 : 3)) * 16)

  for (let i = 0; i < div; i += 1) {
    arrayPos = i * 16

    p = (i * step) - half
    verts[arrayPos] = p
    verts[arrayPos + 1] = 0
    verts[arrayPos + 2] = half
    verts[arrayPos + 3] = 1

    verts[arrayPos + 4] = p
    verts[arrayPos + 5] = 0
    verts[arrayPos + 6] = -half
    verts[arrayPos + 7] = 1

    p = half - (i * step)

    verts[arrayPos + 8] = -half
    verts[arrayPos + 9] = 0
    verts[arrayPos + 10] = p
    verts[arrayPos + 11] = 1

    verts[arrayPos + 12] = half
    verts[arrayPos + 13] = 0
    verts[arrayPos + 14] = p
    verts[arrayPos + 15] = 1
  }

  if (incAxis) {
    verts[arrayPos] = -1.1
    verts[arrayPos + 1] = 0
    verts[arrayPos + 2] = 0
    verts[arrayPos + 3] = 1

    verts[arrayPos + 4] = 1.1
    verts[arrayPos + 5] = 0
    verts[arrayPos + 6] = 0
    verts[arrayPos + 7] = 1

    verts[arrayPos + 8] = 0
    verts[arrayPos + 9] = -1.1
    verts[arrayPos + 10] = 0
    verts[arrayPos + 11] = 2

    verts[arrayPos + 12] = 0
    verts[arrayPos + 13] = 1.1
    verts[arrayPos + 14] = 0
    verts[arrayPos + 15] = 2

    verts[arrayPos + 16] = 0
    verts[arrayPos + 17] = 0
    verts[arrayPos + 18] = -1.1
    verts[arrayPos + 19] = 3

    verts[arrayPos + 20] = 0
    verts[arrayPos + 21] = 0
    verts[arrayPos + 22] = 1.1
    verts[arrayPos + 23] = 3
  }

  const attrColorLocation = 4
  const mesh = {
    drawMode: gl.LINES, vao: gl.createVertexArray(),
  }

  mesh.vertexComponentLen = 4
  mesh.vertexCount = verts.length / mesh.vertexComponentLen

  const strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vertexComponentLen

  mesh.bufVertices = gl.createBuffer()
  gl.bindVertexArray(mesh.vao)
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufVertices)
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)

  gl.enableVertexAttribArray(ATTR_POSITION_LOC)
  gl.enableVertexAttribArray(attrColorLocation)

  gl.vertexAttribPointer(
    ATTR_POSITION_LOC,
    3,
    gl.FLOAT,
    false,
    strideLen,
    0,
  )

  gl.vertexAttribPointer(
    attrColorLocation,
    1,
    gl.FLOAT,
    false,
    strideLen,
    strideLen - Float32Array.BYTES_PER_ELEMENT,
  )

  gl.bindVertexArray(null)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  return mesh
}

export const createGridModel = (gl, incAxis) => new Modal(createGridMesh(gl, incAxis))

export default null
