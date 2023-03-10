export interface Timer {
  readonly duration: number
  readonly current: number;

  /**
   * Starts the timer
   */
  start (): void;

  /**
   * Stops the timer
   */
  stop (): void;

  /**
   * Registers a callback to be notified when the timer is updated
   * @param updateCallback
   */
  onUpdate (updateCallback: () => void): void;

  /**
   * Registers a callback to be notified when the timer is stopped, either manually, or when the time expires.
   * @param stopCallback
   */
  onStop (stopCallback: () => void): void;
}

export default class TimerImpl implements Timer {
  readonly duration: number

  current: number
  private interval: any
  private updateCallback: () => void
  private stopCallbacks = []

  constructor (duration: number) {
    this.duration = duration
  }

  start (): void {
    console.log('timer start')
    this.current = this.duration
    this.interval = setInterval(() => {
      this.updateCallback()
      this.current--
      if (this.current < 0) {
        this.stop()
      }
    }, 1000)
  }

  stop (): void {
    clearInterval(this.interval)
    this.stopCallbacks.forEach(callback => callback())
    console.log('timer stop')
  }

  onUpdate (updateCallback: () => void): void {
    this.updateCallback = updateCallback
  }

  onStop (stopCallback: () => void): void {
    this.stopCallbacks.push(stopCallback)
  }
}
