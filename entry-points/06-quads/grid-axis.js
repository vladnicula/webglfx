import { ATTR_POSITION_LOC } from '../../utils/constants'
import Modal from '../../utils/model'

export const createGridMesh = (gl, incAxis) => {
  const size = 2
  const div = 10
  const step = size / div
  const half = size / 2

  let p
  const verts = []

  for (let i = 0; i < div; i += 1) {
    p = (i * step) - half
    verts.push(p)
    verts.push(0)
    verts.push(half)
    verts.push(0)

    verts.push(p)
    verts.push(0)
    verts.push(-half)
    verts.push(0)

    p = half - (i * step)

    verts.push(-half)
    verts.push(0)
    verts.push(p)
    verts.push(0)

    verts.push(half)
    verts.push(0)
    verts.push(p)
    verts.push(0)
  }

  if (incAxis) {
    verts.push(-1.1)
    verts.push(0)
    verts.push(0)
    verts.push(1)

    verts.push(1.1)
    verts.push(0)
    verts.push(0)
    verts.push(1)

    verts.push(0)
    verts.push(-1.1)
    verts.push(0)
    verts.push(2)

    verts.push(0)
    verts.push(1.1)
    verts.push(0)
    verts.push(2)

    verts.push(0)
    verts.push(0)
    verts.push(-1.1)
    verts.push(3)

    verts.push(0)
    verts.push(0)
    verts.push(1.1)
    verts.push(3)
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
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW)

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
