import Stats from 'stats.js'

import GLInstance from './gl'
import Model from '../../utils/model'

import Shader, {
  readShaderFiles,
} from '../../utils/shader'

class TestShader extends Shader {
  constructor(gl, vertext, fragment) {
    super(gl, vertext, fragment)

    this.uniformLoc.uPointSize = gl.getUniformLocation(this.program, 'uPointSize')
    this.uniformLoc.uAngle = gl.getUniformLocation(this.program, 'uAngle')

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

  const gl = GLInstance(document.getElementById('webgl-main-canvas'))
  gl.fSetSize(500, 500).fClear()

  const testShader = new TestShader(gl, vertexText, fragmentText)
  const mesh = gl.fCreateMeshVAO('dots', null, [
    0, 0, 0,
    0.1, 0.1, 0,
    0.1, -0.1, 0,
    -0.1, 0.1, 0,
    -0.1, -0.1, 0,
  ])
  mesh.drawMode = gl.POINTS
  const model = new Model(mesh)

  const stats = new Stats()
  stats.showPanel(0)
  document.body.appendChild(stats.dom)

  let gPointSize = 0
  const gPointSizeStep = 3

  let dt = 0
  let currentTime = Date.now()


  let gAngle = 0
  const gAngleStep = Math.PI / 20

  const render = () => {
    stats.begin()
    gl.fClear()

    dt = (currentTime - Date.now()) / 1000
    currentTime = Date.now()

    gPointSize += gPointSizeStep * dt
    const size = (Math.sin(gPointSize) * 10) + 30


    gAngle += gAngleStep * dt


    testShader.activate().update(size, gAngle).renderModel(model)

    stats.end()
    window.requestAnimationFrame(render)
  }

  render()
}

main().catch((err) => {
  console.log('runtime error', err)
})
