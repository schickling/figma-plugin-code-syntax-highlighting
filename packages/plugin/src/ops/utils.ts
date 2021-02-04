export class Timer {
  previousTime: number = Date.now()

  /** Logs duration since last tick */
  tick(msg: string) {
    const now = Date.now()
    const diffInMs = now - this.previousTime
    console.log(`Timer (${msg}): ${diffInMs} ms`)
    this.previousTime = now
  }
}
