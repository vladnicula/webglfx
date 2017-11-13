export default class CameraController {
  constructor(gl, camera) {
    const box = gl.canvas.getBoundingClientRect()
    this.canvas = gl.canvas
    this.camera = camera

    this.rotateRate = -300
    this.panRate = 5
    this.zoomRate = 200

    this.offsetX = box.left
    this.offsetY = box.top

    this.initX = 0
    this.initY = 0
    this.prevX = 0
    this.prevY = 0

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseWheel = this.handleMouseWheel.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMoveMove = this.handleMoveMove.bind(this)

    this.canvas.addEventListener('mousewheel', this.handleMouseWheel)
    this.canvas.addEventListener('mousedown', this.handleMouseDown)
  }

  getMouseVec2(e) {
    return {
      x: e.pageX - this.offsetX,
      y: e.pageY - this.offsetY,
    }
  }

  handleMouseDown(ev) {
    this.prevX = ev.pageX - this.offsetX
    this.initX = this.prevX

    this.prevY = ev.pageY - this.offsetY
    this.initY = this.prevY

    this.canvas.addEventListener('mouseup', this.handleMouseUp)
    this.canvas.addEventListener('mousemove', this.handleMoveMove)
  }

  handleMouseUp() {
    this.canvas.removeEventListener('mouseup', this.handleMouseUp)
    this.canvas.removeEventListener('mousemove', this.handleMoveMove)
  }

  handleMouseWheel(ev) {
    const delta = Math.max(-1, Math.min(1, (ev.wheelDelta || -ev.details)))
    this.camera.panZ(delta * (this.zoomRate / this.canvas.height))
  }

  handleMoveMove(ev) {
    const x = ev.pageX - this.offsetX
    const y = ev.pageY - this.offsetY

    const dx = x - this.prevX
    const dy = y - this.prevY

    if (ev.shiftKey) {
      this.camera.transform.rotation.y += dx * (this.rotateRate / this.canvas.width)
      this.camera.transform.rotation.x += dy * (this.rotateRate / this.canvas.height)
    } else {
      this.camera.panX(-dx * (this.panRate / this.canvas.width))
      this.camera.panY(dy * (this.panRate / this.canvas.height))
    }

    this.prevX = x
    this.prevY = y
  }
}
