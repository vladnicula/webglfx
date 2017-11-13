/* eslint-disable function-paren-newline
 */
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

  let dt = 0
  let currentTime = Date.now()
  let angle
  let scale
  let uAngle = 0
  const render = () => {
    stats.begin()
    renderer.clear()

    dt = (Date.now() - currentTime) / 1000
    currentTime = Date.now()
    uAngle += dt
    angle = 10 * Math.sin(uAngle)
    scale = 5 * Math.max(0.2, angle * 10)

    model.setScale(scale, scale * 0.55, 1)
    model.setRotation(30 * angle, 60 * angle, 15 * angle)

    model.preRender()
    testShader.activate().renderModel(model)

    stats.end()
    window.requestAnimationFrame(render)
  }

  render()
}

main().catch((err) => {
  console.log('runtime error', err)
})
