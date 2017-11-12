import path from 'path'

import {
  readFile,
} from './files'

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

/**
 *
 * @param {WebGL2 Context} gl
 * @param {Shader} vShader the vertex shader initialised via webgl2
 * @param {Shader} fShader the fragment shader initialise dvia webgl2
 * @param {Boolean} validation perform validation checkes or not?
 */
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

/**
 *
 * @param {WebGL2 Context} props.gl
 * @param {String} props.vertexName path to vertex file to be read from the filesystem
 * @param {String} props.fragName path to fragment file to be read from the filesystem
 * @param {String} props.dir the directory, if the names of vertext and fragment are relative
 */
export const loadShaderByPathAndCompile = async ({
  gl,
  vertexName = './vert.glsl',
  fragName = './frag.glsl',
  dir,
}) => {
  const [vertexText, fragmentText] = await Promise.all([
    readFile(dir ? path.resolve(dir, vertexName) : vertexName, 'utf8'),
    readFile(dir ? path.resolve(dir, fragName) : fragName, 'utf8'),
  ])

  const vertexShader = createShader(gl, vertexText, gl.VERTEX_SHADER)
  const fragmentShader = createShader(gl, fragmentText, gl.FRAGMENT_SHADER)
  return createProgram(gl, vertexShader, fragmentShader, true)
}

export default null

