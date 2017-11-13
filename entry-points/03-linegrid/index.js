import Stats from 'stats.js'

import WebGLCanvas from '../../utils/webgl-canvas'
import Model from '../../utils/model'

import Shader, {
  readShaderFiles,
} from '../../utils/shader'

import { createGridMesh } from './grid-axis'

class TestShader extends Shader {
  constructor(gl, vertext, fragment, arrayColor) {
    super(gl, vertext, fragment)

    const uColor = gl.getUniformLocation(this.program, 'uColor')
    gl.uniform3fv(uColor, arrayColor)
    gl.useProgram(null)
  }

  update(size, angle) {
    this.gl.uniform1f(this.uniformLoc.uPointSize, size)
    this.gl.uniform1f(this.uniformLoc.uAngle, angle)
    return this
  }
}

const main = async () => {
  const { vertexText, fragmentText } = await readShaderFiles({
    dir: __dirname,
  })

  const renderer = new WebGLCanvas(document.getElementById('webgl-main-canvas'))
  renderer.setSize(500, 500).clear()

  const testShader = new TestShader(renderer.gl, vertexText, fragmentText, [
    0.8, 0.8, 0.8, /**/ 1, 0, 0, /**/ 0, 1, 0, /**/ 0, 0, 1,
  ])

  const mesh = createGridMesh(renderer.gl)

  const model = new Model(mesh)

  const stats = new Stats()
  stats.showPanel(0)
  document.body.appendChild(stats.dom)

  // let dt = 0
  // let currentTime = Date.now()

  const render = () => {
    stats.begin()
    renderer.clear()

    // dt = (currentTime - Date.now()) / 1000
    // currentTime = Date.now()

    testShader.activate().renderModel(model)

    stats.end()
    window.requestAnimationFrame(render)
  }

  render()
}

main().catch((err) => {
  console.log('runtime error', err)
})
