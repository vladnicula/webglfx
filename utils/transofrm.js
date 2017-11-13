import { Vector3, Matrix4 } from './math'

export default class Transform {
  constructor() {
    this.position = new Vector3(0, 0, 0)
    this.scale = new Vector3(1, 1, 1)
    this.rotation = new Vector3(0, 0, 0)

    this.matView = new Matrix4()
    this.matNormal = new Float32Array(9)

    this.forward = new Float32Array(4)
    this.up = new Float32Array(4)
    this.right = new Float32Array(4)
  }

  updateMatrix() {
    this.matView.reset()
      .vtranslate(this.position)
      .rotateX(this.rotation.x * Transform.deg2Rad)
      .rotateY(this.rotation.y * Transform.deg2Rad)
      .rotateZ(this.rotation.z * Transform.deg2Rad)
      .vscale(this.scale)

    Matrix4.normalMat3(this.matNormal, this.matView.raw)

    Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matView.raw) // z
    Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.matView.raw) // y
    Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.matView.raw) // x

    return this.matView.raw
  }

  updateDirection() {
    Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matView.raw) // z
    Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.matView.raw) // y
    Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.matView.raw) // x
    return this
  }

  getViewMatrix() {
    return this.matView.raw
  }

  getNormalMatrix() {
    return this.matNormal
  }

  reset() {
    this.position.set(0, 0, 0)
    this.scale.set(1, 1, 1)
    this.rotation.set(0, 0, 0)
  }
}

Transform.deg2Rad = Math.PI / 180
