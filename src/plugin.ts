import quizService from './service/quizService'

import { Deck, DefaultQuizConfig } from './view/deck'
import { Role } from './model/quiz'
import QuizView from './view/quizView'

import './reveal-quiz.css'
import { initMultiplex } from './multiplex/multiplex'

let deck: Deck

function init (param: Deck) {
  deck = param

  // load default plugin configuration, and merge it with user configuration
  const pluginConfig = deck.getConfig().quiz
  const config = new DefaultQuizConfig()
  config.merge(pluginConfig)

  // findout the role for the current presentation
  const params = new URL(window.location.toString()).searchParams
  const role = params.get('role') as Role
  const isTrainee = role === Role.TRAINEE
  const isTrainer = role === Role.TRAINER || role === Role.ADMIN

  const quiz = quizService.loadOrCreateQuiz(deck, role)
  const quizView = new QuizView(quiz, deck, config)
  quizView.init()

  if (isTrainee || isTrainer) {
    console.log('Initializing multiplexing 🖧')
    initMultiplex(deck, quiz, {
      role,
      presentationSocketUrl: 'http://localhost:3000',
    })
  }

  // for autonomous readers, directly answer the question
  if (!isTrainee && !isTrainer) {
    deck.on('quiz-question-answered', () => {
      console.log('received event questionAnswered')
      deck.dispatchEvent({
        type: 'quiz-show-responses',
        data: {}
      })
    })
  }
  console.log('Initialized reveal-quiz 🙋')
}

export default {
  id: 'RevealQuizz',
  init,
}
