import Transform from './transofrm'

export default class Modal {
  constructor(meshData) {
    this.mesh = meshData
    this.transform = new Transform()
  }

  preRender() {
    this.transform.updateMatrix()
    return this
  }

  setScale(x, y, z) {
    this.transform.scale.set(x, y, z)
    return this
  }

  setPosition(x, y, z) {
    this.transform.position.set(x, y, z)
    return this
  }

  setRotation(x, y, z) {
    this.transform.rotation.set(x, y, z)
    return this
  }

  addScale(x, y, z) {
    const { scale } = this.transform
    scale.x += x
    scale.y += y
    scale.y += z
  }

  addPosition(x, y, z) {
    const { position } = this.transform
    position.x += x
    position.y += y
    position.y += z
  }

  addRotation(x, y, z) {
    const { rotation } = this.transform
    rotation.x += x
    rotation.y += y
    rotation.y += z
  }
}
