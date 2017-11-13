/* eslint-disable function-paren-newline
 */
import Stats from 'stats.js'

import WebGLCanvas from '../../utils/webgl-canvas'
import Model from '../../utils/model'
import Camera from '../../utils/camera'
import CameraController from '../../utils/camera-controller'

import Shader, {
  readShaderFiles,
} from '../../utils/shader'

import { createGridModel } from './grid-axis'

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

  const camera = new Camera(renderer.gl)
  camera.transform.position.set(0, 1, 3)
  const cameraController = new CameraController(renderer.gl, camera)

  const testShader = new TestShader(renderer.gl, vertexText, fragmentText, [
    0.8, 0.8, 0.8, /**/ 1, 0, 0, /**/ 0, 1, 0, /**/ 0, 0, 1,
  ])

  testShader.activate().setPerspective(camera.projectionMatrix).deactivate()

  const model = createGridModel(renderer.gl, true)

  const stats = new Stats()
  stats.showPanel(0)
  document.body.appendChild(stats.dom)


  const render = () => {
    stats.begin()
    renderer.clear()

    camera.updateViewMatrix()


    model.preRender()
    testShader
      .activate()
      .setCameraMatrix(camera.viewMatrix)
      .renderModel(model)

    stats.end()
    window.requestAnimationFrame(render)
  }

  render()
}

main().catch((err) => {
  console.log('runtime error', err)
})
