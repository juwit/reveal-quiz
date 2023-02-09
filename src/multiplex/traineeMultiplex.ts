import Multiplex, { MultiplexConfig, Socket } from './multiplex'
import { Deck } from '../view/deck'
import { Quiz } from '../model/quiz'
import notificationService from '../service/notificationService'

import { io } from 'socket.io-client/dist/socket.io.js'

export default class TraineeMultiplex implements Multiplex {

  private readonly deck: Deck
  private readonly quiz: Quiz
  private readonly config: MultiplexConfig
  private socket: Socket

  constructor (deck: Deck, quiz: Quiz, config: MultiplexConfig) {
    this.deck = deck
    this.quiz = quiz
    this.config = config
  }

  connect (): void {
    // setting lock/unlock events
    this.deck.on('quiz-lock', () => {
      this.deck.configure({
        controls: false,
        keyboard: false,
      })
    })
    this.deck.on('quiz-unlock', () => {
      this.deck.configure({
        controls: true,
        keyboard: true,
      })
    })
    this.deck.on('quiz-reset', () => {
      this.quiz.reset()
    })

    this.socket = io(this.config.presentationSocketUrl + '/trainee')
    this.socket.on('connect', () => {
      console.log('Connected to multiplex engine as a client')
      notificationService.info('Connected to multiplex engine as a client')
      this.deck.dispatchEvent({
        type: 'quiz-lock',
        data: {}
      })
    })
    this.socket.on('connect_error', (err) => {
      console.log('Unable to connect to multiplex engine')
      notificationService.warn('Unable to connect to multiplex engine')
      this.deck.dispatchEvent({
        type: 'quiz-unlock',
        data: {}
      })
    })

    this.socket.on('broadcast', (message) => {
      if (message.state) {
        this.deck.setState(message.state)
      }
      if (message.event) {
        this.deck.dispatchEvent({
          type: message.event.type,
          data: {
            data: message.event.data
          },
        })
      }
    })
    this.socket.emit('user-connected', {
      event: {
        type: 'user-connected',
        data: this.quiz.trainee
      }
    })

    // for trainees, when a question is answered, the result should be send to the trainer (for scoring)
    this.deck.on('quiz-question-answered', (event) => {
      const messageData = {
        event: {
          type: 'quiz-question-answered',
          trainee: this.quiz.trainee,
          data: event.data,
        },
      }
      this.socket.emit('quiz-question-answered', messageData)
    })
  }

}
