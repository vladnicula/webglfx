
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

  return gl
}

export default GLInstance
