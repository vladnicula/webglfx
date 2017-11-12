/**
 *
 * @param {WebGL2 Context} gl
 * @param {String} shaderText the shader code as string
 * @param {Number} shaderType see gl.createShader arguments
 */
export const createShader = (gl, shaderText, shaderType) => {
  const shader = gl.createShader(shaderType)

  gl.shaderSource(shader, shaderText)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const errorLog = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Error compiling shader:${shaderText} ${errorLog}`)
  }

  return shader
}


export const createProgram = (gl, vShader, fShader, validation = true) => {
  const prog = gl.createProgram()
  gl.attachShader(prog, vShader)
  gl.attachShader(prog, fShader)
  gl.linkProgram(prog)

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const errorLog = gl.getProgramInfoLog(prog)
    throw new Error(`Error creating shader program. ${errorLog}`)
  }

  if (validation) {
    gl.validateProgram(prog)

    if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
      const errorLog = gl.getProgramInfoLog(prog)
      throw new Error(`Error validating shader program. ${errorLog}`)
    }
  }

  gl.detachShader(prog, vShader)
  gl.detachShader(prog, fShader)
  gl.deleteShader(fShader)
  gl.deleteShader(vShader)

  return prog
}

export default null

