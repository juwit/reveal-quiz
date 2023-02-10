import quizService from './service/quizService'

import { Deck } from './view/deck'
import { Role } from './model/quiz'
import QuizView from './view/quizView'

import './reveal-quiz.css'
import { initMultiplex } from './multiplex/multiplex'
import {DefaultQuizConfig} from "./config/quizConfig";

let deck: Deck

export function init (param: Deck) {
  deck = param

  // load default plugin configuration, and merge it with user configuration
  const config = new DefaultQuizConfig()
  if(deck.getConfig().quiz){
    config.merge(deck.getConfig().quiz)
  }

  // findout the role for the current presentation
  const params = new URL(window.location.toString()).searchParams
  const role = params.get('role') as Role

  const quiz = quizService.loadOrCreateQuiz(deck, role)
  const quizView = new QuizView(quiz, deck, config)
  quizView.init()

  if (role) {
    console.log('Initializing multiplexing 🖧')
    initMultiplex(deck, quiz, {
      role,
      presentationSocketUrl: 'http://localhost:3000',
    })
  }

  // for autonomous readers, directly answer the question
  if (!role) {
    deck.on('quiz-question-answered', (event) => {
      console.log('received event questionAnswered')
      deck.dispatchEvent({
        type: 'quiz-show-responses',
        data: {
          data: event.data
        }
      })
    })
  }
  console.log('Initialized reveal-quiz 🙋')
}

export const id = 'RevealQuiz'
