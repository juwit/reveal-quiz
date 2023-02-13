import { Question } from '../../model/question'
import { TrainerAnswerView } from '../trainer/answerView'
import { Deck } from '../deck'
import QuestionView from '../questionView'
import TimerImpl from '../../model/timer'
import TimerView from '../timerView'
import QuestionConfig from '../../config/questionConfig'
import { QuizConfig } from "../../config/quizConfig";

export class TrainerQuestionView implements QuestionView {
  question: Question
  section: Element
  answerViews: TrainerAnswerView[] = []
  private deck: Deck
  private showResponsesButton: HTMLButtonElement
  private config: QuizConfig
  private readonly explanationElement: HTMLQuoteElement

  constructor (question: Question, section: Element, deck: Deck, globalConfig: QuizConfig) {
    this.question = question
    this.section = section
    this.deck = deck
    this.config = new QuestionConfig(this.section, globalConfig)

    this.section.setAttribute('data-quiz-question-id', this.question.id.toString())

    if(this.question.explanation) {
      // show explanation
      this.explanationElement = document.createElement('blockquote')
      this.explanationElement.textContent = this.question.explanation
      this.explanationElement.classList.add('explanation')
      this.section.append(this.explanationElement)
    }
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
    if(this.explanationElement) {
      this.section.append(this.explanationElement)
    }

    // send event
    this.deck.dispatchEvent({
      type: 'quiz-show-responses',
      data: {
        data: {
          id: this.question.id
        }
      }
    })
  }

  renderAnswers (form: HTMLFormElement) {
    const multipleCorrectAnswers = this.question.answers.filter(it => it.correct).length > 1
    const questionType = multipleCorrectAnswers ? 'checkbox' : 'radio'
    this.question.answers.forEach(it => it.type = questionType)

    this.question.answers.forEach(it => {
      const div = document.createElement('div')
      form.append(div)
      const view = new TrainerAnswerView(it, div, this.deck)
      view.renderAnswer()
      this.answerViews.push(view)
    })
  }

  renderQuestion () {
    this.section.innerHTML = ''
    this.section.classList.add('reveal-quiz-question')

    // add the title
    const questionTitle = document.createElement('h1')
    questionTitle.textContent = this.question.text
    this.section.append(questionTitle)

    if(this.deck.hasPlugin('markdown')){
      const marked = this.deck.getPlugin('markdown').marked
      questionTitle.innerHTML = marked.parseInline(this.question.text)
    }

    // add the form
    const form = document.createElement('form')
    this.section.append(form)

    this.renderAnswers(form)

    this.showResponsesButton = document.createElement('button')
    this.showResponsesButton.textContent = 'Show responses'
    this.showResponsesButton.addEventListener('click', () => {
      this.showResponses()
    })
    form.append(this.showResponsesButton)

    this.section.setAttribute('data-quiz-question-id', this.question.id.toString())
  }

  reset () {
    this.answerViews.forEach(it => it.renderAnswer())
    this.section.getElementsByTagName('form')[0].append(this.showResponsesButton)
    if(this.explanationElement){
      this.explanationElement.remove()
    }
  }
}
