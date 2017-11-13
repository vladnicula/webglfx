import path from 'path'

import {
  readFile,
} from './files'

import {
  ATTR_POSITION_LOC,
  ATTR_POSITION_NAME,
  ATTR_NORMAL_LOC,
  ATTR_NORMAL_NAME,
  ATTR_UV_LOC,
  ATTR_UV_NAME,
  UNIF_PERSPECTIVE_NAME,
  UNIF_MODEL_VIEW_NAME,
  UNIF_CAMERA_NAME,
} from './constants'

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

  gl.bindAttribLocation(prog, ATTR_POSITION_LOC, ATTR_POSITION_NAME)
  gl.bindAttribLocation(prog, ATTR_NORMAL_LOC, ATTR_NORMAL_NAME)
  gl.bindAttribLocation(prog, ATTR_UV_LOC, ATTR_UV_NAME)

  gl.linkProgram(prog)

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const errorLog = gl.getProgramInfoLog(prog)
    gl.deleteProgram(prog)
    throw new Error(`Error creating shader program. ${errorLog}`)
  }

  if (validation) {
    gl.validateProgram(prog)

    if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
      const errorLog = gl.getProgramInfoLog(prog)
      gl.deleteProgram(prog)
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
 * Reads two files and resolves with text from both of them.
 * Used by the shader loading tools
 *
 * @param {String} props.vertexName path to vertex file to be read from the filesystem
 * @param {String} props.fragName path to fragment file to be read from the filesystem
 * @param {String} props.dir the directory, if the names of vertext and fragment are relative
 */
export const readShaderFiles = async ({
  vertexName = './vert.glsl',
  fragName = './frag.glsl',
  dir,
}) => {
  const [vertexText, fragmentText] = await Promise.all([
    readFile(dir ? path.resolve(dir, vertexName) : vertexName, 'utf8'),
    readFile(dir ? path.resolve(dir, fragName) : fragName, 'utf8'),
  ])

  return {
    vertexText, fragmentText,
  }
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
  const [vertexText, fragmentText] = await readShaderFiles(vertexName, fragName, dir)

  const vertexShader = createShader(gl, vertexText, gl.VERTEX_SHADER)
  const fragmentShader = createShader(gl, fragmentText, gl.FRAGMENT_SHADER)
  return createProgram(gl, vertexShader, fragmentShader, true)
}

export const getStandardAttribLocation = (gl, program) => ({
  position: gl.getAttribLocation(program, ATTR_POSITION_NAME),
  normal: gl.getAttribLocation(program, ATTR_NORMAL_NAME),
  uv: gl.getAttribLocation(program, ATTR_UV_NAME),
})

export const getstandardUniformLocation = (gl, program) => ({
  perspective: gl.getUniformLocation(program, UNIF_PERSPECTIVE_NAME),
  modelMatrix: gl.getUniformLocation(program, UNIF_MODEL_VIEW_NAME),
  cameraMatrix: gl.getUniformLocation(program, UNIF_CAMERA_NAME),
  mainTexture: gl.getUniformLocation(program, UNIF_CAMERA_NAME),
})

export default class Shader {
  constructor(gl, vertexShaderText, fragmentShaderText, validation) {
    try {
      const vertexShader = createShader(gl, vertexShaderText, gl.VERTEX_SHADER)
      const fragmentShader = createShader(gl, fragmentShaderText, gl.FRAGMENT_SHADER)
      this.program = createProgram(gl, vertexShader, fragmentShader, validation)
    } catch (err) {
      console.error('could not create shader instance')
      console.error(err)
    }

    this.gl = gl
    gl.useProgram(this.program)
    this.attribLoc = getStandardAttribLocation(gl, this.program)
    this.uniformLoc = getstandardUniformLocation(gl, this.program)
  }

  setPerspective(matData) {
    this.gl.uniformMatrix4fv(this.uniformLoc.perspective, false, matData)
    return this
  }

  setModelMatrix(matData) {
    this.gl.uniformMatrix4fv(this.uniformLoc.modelMatrix, false, matData)
    return this
  }

  setCameraMatrix(matData) {
    this.gl.uniformMatrix4fv(this.uniformLoc.cameraMatrix, false, matData)
    return this
  }

  activate() {
    this.gl.useProgram(this.program)
    return this
  }

  deactivate() {
    this.gl.useProgram(null)
    return this
  }

  dispose() {
    if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) {
      this.gl.useProgram(null)
    }

    this.gl.deleteProgram(this.program)
  }

  renderModel(model) {
    this.setModelMatrix(model.transform.getViewMatrix())
    this.gl.bindVertexArray(model.mesh.vao)

    if (model.mesh.noCulling) {
      this.gl.disable(this.gl.CULL_FACE)
    }

    if (model.mesh.doBlending) {
      this.gl.enable(this.gl.BLEND)
    }


    if (model.mesh.indexCount) {
      this.gl.drawElements(
        model.mesh.drawMode,
        model.mesh.indexCount,
        this.gl.UNSIGNED_SHORT,
        0,
      )
    } else {
      this.gl.drawArrays(
        model.mesh.drawMode,
        0,
        model.mesh.vertexCount,
      )
    }

    this.gl.bindVertexArray(null)

    if (model.mesh.noCulling) {
      this.gl.enable(this.gl.CULL_FACE)
    }

    if (model.mesh.doBlending) {
      this.gl.disable(this.gl.BLEND)
    }

    return this
  }
}

