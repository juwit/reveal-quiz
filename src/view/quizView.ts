import { Deck } from './deck'
import { Quiz, Role } from '../model/quiz'
import { TrainerQuestionView } from './trainer/TrainerQuestionView'
import { TraineeQuestionView } from './trainee/TraineeQuestionView'
import AdminView from './admin/adminView'
import QuestionView from './questionView'
import { QuizConfig } from "../config/quizConfig";

export default class QuizView {
  private readonly quiz: Quiz
  private readonly config: QuizConfig
  private readonly deck: Deck
  private questionViews: QuestionView[] = []

  constructor (quiz: Quiz, deck: Deck, config: QuizConfig) {
    this.quiz = quiz
    this.deck = deck
    this.config = config
  }

  init () {
    const sections = this.deck.getRevealElement().querySelectorAll('[data-quiz]')

    if (this.quiz.role === Role.ADMIN) {
      // add the admin component
      const adminView = new AdminView(this.deck)
      adminView.render()
    }

    this.quiz.questions.forEach(question => {
      let questionView
      if (this.quiz.role === Role.TRAINER || this.quiz.role === Role.ADMIN) {
        questionView = new TrainerQuestionView(question, sections[question.id], this.deck, this.config)
      } else {
        questionView = new TraineeQuestionView(question, sections[question.id], this.deck, this.config)
      }
      questionView.renderQuestion()
      if (question.isAnswered()) {
        questionView.showResponses()
      }
      this.questionViews.push(questionView)
    })

    this.deck.on('slidechanged', event => {
      // get question of current slide
      const slideSection = event.currentSlide
      const questionId = slideSection.getAttribute('data-quiz-question-id')
      if (questionId !== null) {
        // slide holds a question, otherwise its a simple slide
        const questionView = this.questionViews[questionId]
        questionView.show()
      }
    })

    this.deck.on('quiz-reset', event => {
      this.questionViews.forEach(it => it.reset());
    })
  }
}
