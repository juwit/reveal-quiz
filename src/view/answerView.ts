import { Answer } from '../model/answer'
import { Deck } from './deck'

/**
 * Represents the view for an answer, basically a simple checkbox or radio button in a form.
 * This view is responsible for rendering in a given HTMLElement.
 */
export interface AnswerView {

  /**
   * Renders the answer as a checkbox or a radio button, in order to be able to select it as a user.
   */
  renderAnswer (): void;

  /**
   * Computes the state of the current view, to pass it to the underlying answer.
   * If the checkbox is checked, the answer should be selected.
   */
  computeState (): void;

  /**
   * Locks the current answer, so the user should not be able to select it.
   */
  lock (): void;

  /**
   * Renders the answer as a response.
   * If the user selected the answer, and the answer is correct, it is expected to render in green, in red otherwise.
   */
  showResponse (): void;
}

export abstract class AbstractAnswerView implements AnswerView {
  protected answer: Answer
  protected div: HTMLDivElement
  private deck: Deck

  protected constructor (answer: Answer, div: HTMLDivElement, deck: Deck) {
    this.answer = answer
    this.div = div
    this.deck = deck
  }

  renderAnswer () {
    this.div.classList.add('reveal-quiz-answer')
    this.div.classList.remove('correct', 'incorrect')

    let answerText = this.answer.text
    if(this.deck.hasPlugin('markdown')){
      const marked = this.deck.getPlugin('markdown').marked
      answerText = marked.parseInline(this.answer.text)
    }

    this.div.innerHTML = `
            <input type="${this.answer.type}" name="answer" id="${this.answer.text}" />
            <label for="${this.answer.text}">${answerText}</label>
        `
  }

  computeState () {
    const input = this.div.getElementsByTagName('input')[0]
    this.answer.selected = input.checked
  }

  lock () {
    const input = this.div.getElementsByTagName('input')[0]
    input.classList.add('locked')
    input.disabled = true
  }

  abstract showResponse (): void;
}
