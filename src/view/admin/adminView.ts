import { Deck } from '../deck'
import { TrainingSession } from '../../model/trainingSession'

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
  private buildActionButton(label: string, eventType: string): HTMLButtonElement{
    const actionButton = document.createElement('button')
    actionButton.textContent = label
    actionButton.onclick = () => {
      this.deck.dispatchEvent({
        type: eventType ,
        data: {}
      })
    }
    return actionButton
  }

  render (): void {
    console.log('Rendering Admin controls')
    const adminDiv: HTMLDivElement = document.createElement('div')
    adminDiv.classList.add('quiz-admin-controls')
    adminDiv.textContent = 'Admin controls'

    adminDiv.append(this.buildActionButton('Lock', 'quiz-lock'))
    adminDiv.append(this.buildActionButton('Unlock', 'quiz-unlock'))
    adminDiv.append(this.buildActionButton('Reset Quiz', 'quiz-reset'))
    adminDiv.append(this.buildActionButton('Show QR Code', 'qrcode-show'))
    adminDiv.append(this.buildActionButton('Hide QR Code', 'qrcode-hide'))

    // insert admin div just before the slides
    this.reveal.before(adminDiv)

    // add class to parent to allow styling
    this.reveal.parentElement.classList.add('quiz-admin')
  }

}
