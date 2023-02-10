import { Timer } from '../model/timer'

import './reveal-quiz-timer.css'

export default class TimerView {
  private timer: Timer
  private readonly element: Element

  private timerElement: HTMLElement = null

  constructor (timer: Timer, element: Element) {
    this.timer = timer
    this.element = element

    this.timer.onUpdate(() => this.render())
    this.timer.onStop(() => {
      // removing the timer component 5 seconds after the stop
      setTimeout(() => {
        this.timerElement.remove()
      }, 5000)
    })
  }

  /**
   * renders the timer on the slide
   */
  render (): void {
    if (this.timerElement === null) {
      // first render, create the object and add it to the section
      this.timerElement = document.createElement('aside')
      this.timerElement.classList.add('timer')
      this.element.append(this.timerElement)
    }

    this.timerElement.classList.remove('timer-66', 'timer-33', 'timer-0')
    // compute classes for colors
    if (this.timer.current > (this.timer.duration * 0.66)) {
      this.timerElement.classList.add('timer-66')
    } else if (this.timer.current > (this.timer.duration * 0.33)) {
      this.timerElement.classList.add('timer-33')
    } else {
      this.timerElement.classList.add('timer-0')
    }

    this.timerElement.textContent = `${this.timer.current}`
  }
}
