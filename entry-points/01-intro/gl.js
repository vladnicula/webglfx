
/* eslint-disable no-bitwise
 */
const GLInstance = (canvasNode) => {
  const gl = canvasNode.getContext('webgl2')

  gl.clearColor(1.0, 1.0, 1.0, 1.0)

  gl.fClear = () => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    return gl
  }

  gl.fSetSize = (width, height) => {
    canvasNode.width = width
    canvasNode.height = height

    gl.viewport(0, 0, width, height)

    return gl
  }

  gl.fCreateArrayBuffer = (floatArray, isStatic = true) => {
    const buffer = gl.createBuffer()
    const staticStatus = isStatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, floatArray, staticStatus)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    return buffer
  }

  return gl
}

export default GLInstance
