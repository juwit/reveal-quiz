import { Answer } from '../../model/answer'
import { AbstractAnswerView } from '../answerView'

export class TraineeAnswerView extends AbstractAnswerView {

  constructor (answer: Answer, div: HTMLDivElement) {
    super(answer, div)
  }

  /**
   * For a Trainee, showing a response status
   */
  showResponse () {
    console.log(this.answer)
    // selected correct answer
    if (this.answer.correct && this.answer.selected) {
      this.div.classList.add('correct')
    }
    // not selected correct answer
    if (this.answer.correct && !this.answer.selected) {
      this.div.classList.add('incorrect')
    }
    // selected incorrect answer
    if (!this.answer.correct && this.answer.selected) {
      this.div.classList.add('incorrect')
    }
  }
}
