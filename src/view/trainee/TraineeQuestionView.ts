import { Question } from '../../model/question'
import { TraineeAnswerView } from './answerView'
import { Deck } from '../deck'
import QuestionView from '../questionView'
import TimerImpl from '../../model/timer'
import TimerView from '../timerView'
import QuestionConfig from '../../config/questionConfig'
import { QuizConfig } from "../../config/quizConfig";
import { Answer } from "../../model/answer";

export class TraineeQuestionView implements QuestionView {
  question: Question
  section: Element
  answerViews: TraineeAnswerView[] = []
  private deck: Deck
  private submitButton: HTMLButtonElement
  private config: QuizConfig
  private readonly explanationElement: HTMLQuoteElement

  constructor (question: Question, section, deck: Deck, globalConfig: QuizConfig) {
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
        // auto submitting the question when the timer stops !
        this.submitQuestion()
      })
    }
  }

  submitQuestion () {
    console.log(`Question ${this.question.text} submitted !`)

    this.question.answer()
    this.answerViews.forEach(it => it.computeState())

    // lock the question to disallow futher answers
    this.answerViews.forEach(it => it.lock())

    // remove submit button
    this.submitButton.remove()

    console.log('Sending questionAnswered event')
    this.deck.dispatchEvent({
      type: 'quiz-question-answered',
      data: {
        data: this.question
      }
    })
  }

  /**
   * Show the correct and incorrect responses on the question
   */
  showResponses () {
    console.log(`Showing answers and explanation`)

    this.answerViews.forEach(it => it.showResponse())
    this.submitButton.remove()
    if(this.explanationElement) {
      this.section.append(this.explanationElement)
    }
  }

  renderAnswers (form: HTMLFormElement) {
    const multipleCorrectAnswers = this.question.answers.filter(it => it.correct).length > 1
    const questionType = multipleCorrectAnswers ? 'checkbox' : 'radio'
    this.question.answers.forEach(it => it.type = questionType)

    // randomize answers
    let answers: Answer[] = this.question.answers
    if(this.config.randomizeAnswers){
      const answersAndRandoms: [Answer, number][] = this.question.answers
        .map(answer=> [answer, Math.random()]) // associate each answer with a random number
      answersAndRandoms
        .sort((a,b) => b[1] - a [1])
      answers = answersAndRandoms.map(it => it[0])
    }

    answers.forEach(it => {
      const div = document.createElement('div')
      form.append(div)
      const view = new TraineeAnswerView(it, div, this.deck)
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

    this.submitButton = document.createElement('button')
    this.submitButton.textContent = 'Submit'
    this.submitButton.addEventListener('click', () => {
      this.submitQuestion()
    })
    form.append(this.submitButton)

    // register the show responses
    const showResponseCallback = (event) => {
      if(event.data.id !== this.question.id){
        return
      }
      this.showResponses()
      this.deck.off('quiz-show-responses', showResponseCallback)
    }
    this.deck.on('quiz-show-responses', showResponseCallback)
  }

  reset () {
    this.answerViews.forEach(it => it.renderAnswer());
    this.section.getElementsByTagName('form')[0].append(this.submitButton);
    if(this.explanationElement){
      this.explanationElement.remove()
    }
  }
}
