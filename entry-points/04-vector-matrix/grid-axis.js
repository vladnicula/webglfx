import { ATTR_POSITION_LOC } from '../../utils/constants'

export const createGridMesh = (gl) => {
  const size = 1.8
  const div = 10
  const step = size / div
  const half = size / 2

  let p
  let arrayPos = 0
  const verts = new Float32Array(div * 4 * 4)

  for (let i = 0; i < div; i += 1) {
    arrayPos = i * 16

    p = (i * step) - half
    verts[arrayPos] = p
    verts[arrayPos + 1] = half
    verts[arrayPos + 2] = 0
    verts[arrayPos + 3] = 1

    verts[arrayPos + 4] = p
    verts[arrayPos + 5] = -half
    verts[arrayPos + 6] = 0
    verts[arrayPos + 7] = 1

    p = half - (i * step)

    verts[arrayPos + 8] = -half
    verts[arrayPos + 9] = p
    verts[arrayPos + 10] = 0
    verts[arrayPos + 11] = 1

    verts[arrayPos + 12] = half
    verts[arrayPos + 13] = p
    verts[arrayPos + 14] = 0
    verts[arrayPos + 15] = 1
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

export default null
