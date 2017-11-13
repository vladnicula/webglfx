
export default class RenderLoop {
  constructor(callback, fps) {
    this.msLastFrame = null
    this.callback = callback
    this.isActive = false

    let msCurrent
    let msDelta
    let deltaTime

    if (fps) {
      this.msFpsLimit = 1000 / fps

      this.run = () => {
        msCurrent = new Date().getTime()
        msDelta = (msCurrent - this.msLastFrame)
        deltaTime = msDelta / 1000.0

        if (msDelta >= this.msFpsLimit) { // Now execute frame since the time has elapsed.
          this.msLastFrame = msCurrent
          callback(deltaTime)
        }

        if (this.isActive) window.requestAnimationFrame(this.run)
      }
    } else {
      this.run = () => {
        msCurrent = new Date().getTime()
        deltaTime = msDelta / 1000.0

        this.msLastFrame = msCurrent
        callback(deltaTime)

        if (this.isActive) window.requestAnimationFrame(this.run)
      }
    }
  }

  start() {
    this.isActive = true
    this.msLastFrame = performance.now()
    window.requestAnimationFrame(this.run)
    return this
  }

  stop() { this.isActive = false }
}
