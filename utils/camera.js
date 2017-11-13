import { Matrix4 } from './math'
import Transform from './transform'
import {
  CAMERA_MODE_FREE, CAMERA_MODE_ORBIT,
} from './constants'

export default class Camera {
  constructor(gl, fov, near, far) {
    this.projectionMatrix = new Float32Array(16)
    const ratio = gl.canvas.width / gl.canvas.height
    Matrix4.perspective(this.projectionMatrix, fov || 45, ratio, near || 0.1, far || 100.0)

    this.transform = new Transform()
    this.viewMatrix = new Float32Array(16)

    this.mode = CAMERA_MODE_ORBIT
  }

  panX(v) {
    if (this.mode === CAMERA_MODE_ORBIT) return
    this.updateViewMatrix()
    this.transform.position.x += this.transform.rigth[0] * v
    this.transform.position.y += this.transform.rigth[1] * v
    this.transform.position.z += this.transform.rigth[2] * v
  }

  panY(v) {
    this.updateViewMatrix()
    this.transform.position.y += this.transform.up[1] * v
    if (this.mode === CAMERA_MODE_ORBIT) return
    this.transform.position.x += this.transform.up[0] * v
    this.transform.position.z += this.transform.up[2] * v
  }

  panZ(v) {
    this.updateViewMatrix()

    if (this.mode === CAMERA_MODE_ORBIT) {
      this.transform.position.z += v
      return
    }

    this.transform.position.x += this.transform.forward[0] * v
    this.transform.position.y += this.transform.forward[1] * v
    this.transform.position.z += this.transform.forward[2] * v
  }

  updateViewMatrix() {
    if (this.mode === CAMERA_MODE_FREE) {
      this.transform.matView.reset()
        .vtranslate(this.transform.position)
        .rotateX(this.transform.rotation.x * Transform.deg2Rad)
        .rotateY(this.transform.rotation.y * Transform.deg2Rad)
    } else {
      this.transform.matView.reset()
        .rotateX(this.transform.rotation.x * Transform.deg2Rad)
        .rotateY(this.transform.rotation.y * Transform.deg2Rad)
        .vtranslate(this.transform.position)
    }

    this.transform.updateDirection()

    Matrix4.invert(this.viewMatrix, this.transform.matView.raw)

    return this.viewMatrix
  }
}
