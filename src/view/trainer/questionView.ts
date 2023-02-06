import { Question } from '../../model/question'
import { TrainerAnswerView } from '../trainer/answerView'
import { Deck, QuizConfig } from '../deck'
import QuestionView from '../questionView'
import TimerImpl from '../../model/timer'
import TimerView from '../timerView'

export class TrainerQuestionView implements QuestionView {
  question: Question
  section: Element
  answerViews: TrainerAnswerView[] = []
  private deck: Deck
  private showResponsesButton: HTMLButtonElement
  private config: QuizConfig

  constructor (question: Question, section, deck: Deck, config: QuizConfig) {
    this.question = question
    this.section = section
    this.deck = deck
    this.config = config

    this.section.setAttribute('data-quiz-question-id', this.question.id.toString())
  }

  show () {
    console.log(`Showing question ${this.question.text}`)

    if (!this.question.isAnswered() && this.config.useTimer) {
      const timer = new TimerImpl(this.config.timerDuration)
      const timerView = new TimerView(timer, this.section)
      timer.start()
      timer.onStop(() => {
        // auto showing responses when the timer stops !
        this.question.answer()
        this.showResponses()
      })
    }
  }

  showResponses () {
    console.log(`Showing answers and explanation`)

    // remove button
    this.showResponsesButton.remove()

    this.answerViews.forEach(it => it.showResponse())

    // show explanation
    const blockquote = document.createElement('blockquote')
    blockquote.textContent = this.question.explanation
    blockquote.classList.add('explanation')
    this.section.append(blockquote)

    // send event
    this.deck.dispatchEvent({
      type: 'quiz-show-responses',
      data: {}
    })
  }

  renderAnswers (form: HTMLFormElement) {
    const multipleCorrectAnswers = this.question.answers.filter(it => it.correct).length > 1
    const questionType = multipleCorrectAnswers ? 'checkbox' : 'radio'
    this.question.answers.forEach(it => it.type = questionType)

    this.question.answers.forEach(it => {
      const div = document.createElement('div')
      form.append(div)
      const view = new TrainerAnswerView(it, div)
      view.renderAnswer()
      this.answerViews.push(view)
    })
  }

  renderQuestion () {
    this.section.innerHTML = `
            <h1>${this.question.text}</h1>
            <form>
                <button type="button">Show responses</button>
            </form>
        `
    this.section.classList.add('reveal-quiz-question')
    this.showResponsesButton = this.section.getElementsByTagName('button')[0]
    this.showResponsesButton.addEventListener('click', () => {
      this.showResponses()
    })

    const form = this.section.getElementsByTagName('form')[0]
    this.renderAnswers(form)

    this.section.setAttribute('data-quiz-question-id', this.question.id.toString())
  }
}
