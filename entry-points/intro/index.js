import Stats from 'stats.js'

import GLInstance from './gl'

import {
  loadShaderByPathAndCompile,
} from '../../utils/shader'

const gl = GLInstance(document.getElementById('webgl-main-canvas'))
gl.fSetSize(500, 500).fClear()

loadShaderByPathAndCompile({
  gl,
  dir: __dirname,
})
  .then((shaderProgram) => {
    gl.useProgram(shaderProgram)
    const aPositionLoc = gl.getAttribLocation(shaderProgram, 'aPosition')
    const uPointSizeLoc = gl.getUniformLocation(shaderProgram, 'uPointSize')
    const uAngle = gl.getUniformLocation(shaderProgram, 'uAngle')
    gl.useProgram(null)


    const arrayVerts = new Float32Array([0, 0, 0, 0.5, 0.5, 0])
    const bufferVerts = gl.fCreateArrayBuffer(arrayVerts, true)

    gl.useProgram(shaderProgram)

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferVerts)

    gl.enableVertexAttribArray(aPositionLoc)
    gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

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
      gl.uniform1f(uPointSizeLoc, size)

      gAngle += gAngleStep * dt
      gl.uniform1f(uAngle, gAngle)

      gl.drawArrays(gl.POINTS, 0, arrayVerts.length / 3)
      stats.end()
      window.requestAnimationFrame(render)
    }

    render()
  })

