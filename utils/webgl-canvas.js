/* eslint-disable no-bitwise */
import {
  ATTR_POSITION_LOC,
  ATTR_NORMAL_LOC,
  ATTR_UV_LOC,
} from './constants'

export default class WebGLCanvas {
  constructor(canvasNode) {
    this.gl = canvasNode.getContext('webgl2')
    this.canvasNode = canvasNode
    this.mMeshCache = {} // cache all the mesh structs, easy to unload buffers if the all exist here

    this.gl.clearColor(1.0, 1.0, 1.0, 1.0)
  }

  setSize(width, height) {
    const { gl, canvasNode } = this

    canvasNode.width = width
    canvasNode.height = height

    gl.viewport(0, 0, width, height)

    return this
  }

  clear() {
    const { gl } = this
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    return this
  }

  createMeshVAO(name, arrayIndex, arrayVertex, arrayNormals, arrayUVs) {
    const { gl } = this

    const instructions = {
      drawMode: gl.TRIANGLES,
    }
    const vao = gl.createVertexArray()
    instructions.vao = vao
    gl.bindVertexArray(vao)

    if (arrayVertex !== undefined && arrayVertex != null) {
      instructions.bufVertices = gl.createBuffer()
      instructions.vertexComponentLen = 3
      instructions.vertexCount = arrayVertex.length / 3
      gl.bindBuffer(gl.ARRAY_BUFFER, instructions.bufVertices)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayVertex), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(ATTR_POSITION_LOC)
      gl.vertexAttribPointer(ATTR_POSITION_LOC, 3, gl.FLOAT, false, 0, 0)
    }


    if (arrayNormals !== undefined && arrayNormals != null) {
      instructions.bufNormals = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, instructions.bufNormals)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayNormals), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(ATTR_NORMAL_LOC)
      gl.vertexAttribPointer(ATTR_NORMAL_LOC, 3, gl.FLOAT, false, 0, 0)
    }


    if (arrayUVs !== undefined && arrayUVs != null) {
      instructions.bufUVs = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, instructions.bufUVs)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayUVs), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(ATTR_UV_LOC)
      gl.vertexAttribPointer(ATTR_UV_LOC, 2, gl.FLOAT, false, 0, 0)
    }

    if (arrayIndex !== undefined && arrayIndex != null) {
      instructions.bufIdx = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, instructions.bufIdx)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrayIndex), gl.STATIC_DRAW)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    }

    gl.bindVertexArray(null)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    this.mMeshCache[name] = instructions
    return instructions
  }

  fitScreen(wp, hp) {
    this.setSize(
      window.innerWidth * (wp || 1),
      window.innerHeight * (hp || 1),
    )
  }
}
