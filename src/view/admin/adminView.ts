import { Deck } from '../deck'
import notificationService from '../../service/notificationService'
import utilsService from '../../service/utilsService'

import './admin.css'

export interface AdminView {
  render (): void;
}

export default class AdminViewImpl implements AdminView {
  private reveal: HTMLElement
  private deck: Deck

  constructor (deck: Deck) {
    this.deck = deck
    this.reveal = deck.getRevealElement()
  }

  /**
   * builds a button that dispatches an event to the deck
   * @param label the label of the button
   * @param eventType the type of the event
   * @private
   */
  private buildDispatchButton (label: string, eventType: string): HTMLButtonElement {
    const actionButton = document.createElement('button')
    actionButton.textContent = label
    actionButton.onclick = () => {
      this.deck.dispatchEvent({
        type: eventType,
        data: {}
      })
    }
    return actionButton
  }

  /**
   * builds a button that runs a callback
   * @param label the label of the button
   * @param callback the callback to call when the button is clicked
   * @private
   */
  private buildActionButton (label: string, callback: () => void): HTMLButtonElement {
    const actionButton = document.createElement('button')
    actionButton.textContent = label
    actionButton.onclick = callback
    return actionButton
  }

  render (): void {
    console.log('Rendering Admin controls')
    const adminDiv: HTMLDivElement = document.createElement('div')
    adminDiv.classList.add('quiz-admin-controls')
    adminDiv.textContent = 'Admin controls'

    adminDiv.append(this.buildDispatchButton('Lock', 'quiz-lock'))
    adminDiv.append(this.buildDispatchButton('Unlock', 'quiz-unlock'))
    adminDiv.append(this.buildDispatchButton('Reset Quiz', 'quiz-reset'))
    adminDiv.append(this.buildDispatchButton('Show QR Code', 'qrcode-show'))
    adminDiv.append(this.buildDispatchButton('Hide QR Code', 'qrcode-hide'))
    adminDiv.append(this.buildActionButton('Copy Trainee Link', () => {
      navigator.clipboard.writeText(utilsService.generateTraineeUrl())
        .then(() => {
          notificationService.info(`Trainee URL copied to clipboard `)
        })
    }))
    adminDiv.append(this.buildActionButton('Copy Trainer Link', () => {
      navigator.clipboard.writeText(utilsService.generateTrainerUrl())
        .then(() => {
          notificationService.info(`Trainer URL copied to clipboard`)
        })
    }))

    // insert admin div just before the slides
    this.reveal.before(adminDiv)

    // add class to parent to allow styling
    this.reveal.parentElement.classList.add('quiz-admin')
  }

}
