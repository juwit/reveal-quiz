import { Deck } from '../view/deck'
import { Quiz, Trainee } from '../model/quiz'
import Multiplex, { MultiplexConfig, Socket } from './multiplex'
import notificationService from '../service/notificationService'
import { TrainingSession } from '../model/trainingSession'
import { Question } from '../model/question'
import QRCodeView from '../view/trainer/qrcodeView'

import { io } from 'socket.io-client/dist/socket.io.js'

export default class AdminMultiplex implements Multiplex {

  private readonly deck: Deck
  private readonly quiz: Quiz
  private readonly config: MultiplexConfig
  private socket: Socket

  constructor (deck: Deck, quiz: Quiz, config: MultiplexConfig) {
    this.deck = deck
    this.quiz = quiz
    this.config = config
  }

  private postState () {
    const messageData = {
      state: this.deck.getState()
    }
    console.log('Sending state ', messageData)
    this.socket.emit('broadcast', messageData)
  }

  private postEvent (event) {
    const messageData = {
      event: {
        type: event.type,
        data: event.data
      }
    }
    console.log('Sending event ', messageData)
    this.socket.emit('broadcast', messageData)
  }

  connect (): void {
    this.socket = io(this.config.presentationSocketUrl + '/admin')
    this.socket.on('connect', () => {
      console.log('Connected to multiplex engine as an Admin')
      notificationService.info('Connected to multiplex engine as an admin')
    })
    this.socket.on('connect_error', (err) => {
      console.log('Unable to connect to multiplex engine')
      notificationService.warn('Unable to connect to multiplex engine')
    })

    TrainingSession.init(this.quiz)
    this.socket.on('trainee-quiz-question-answered', (message) => {
      const {
        trainee,
        data
      } = message.event
      Object.setPrototypeOf(trainee, Trainee.prototype)
      Object.setPrototypeOf(data, Question.prototype)
      console.log(`Receiving answer for trainee ${trainee.id}`)
      TrainingSession.instance.addAnswer(trainee, data)
    })
    this.socket.on('user-connected', (message) => {
      const { trainee } = message.event
      Object.setPrototypeOf(trainee, Trainee.prototype)
      console.log(`Receiving connection for trainee ${trainee.id}`)
      TrainingSession.instance.addTrainee(trainee)
    })

    const postStateCallback = () => this.postState()
    const postEventCallback = (event) => this.postEvent(event)

    this.socket.on('broadcast', (message) => {
      if (message.state) {
        console.log('admin event')
        // remove the event listener while setting the state
        this.deck.off('slidechanged', postStateCallback)
        this.deck.setState(message.state)
        this.deck.on('slidechanged', postStateCallback)
      }
      if (message.event) {
        this.deck.dispatchEvent(message.event)
      }
    })

    // Monitor events that trigger a change in state
    this.deck.on('slidechanged', postStateCallback)
    this.deck.on('fragmentshown', postStateCallback)
    this.deck.on('fragmenthidden', postStateCallback)
    this.deck.on('overviewhidden', postStateCallback)
    this.deck.on('overviewshown', postStateCallback)
    this.deck.on('paused', postStateCallback)
    this.deck.on('resumed', postStateCallback)

    // Monitor events that should be broadcasted to other presentations
    this.deck.on('quiz-show-responses', postEventCallback)
    this.deck.on('quiz-lock', postEventCallback)
    // on locking, also send state to force users to current slide
    this.deck.on('quiz-lock', postStateCallback)
    this.deck.on('quiz-unlock', postEventCallback)
    this.deck.on('quiz-reset', postEventCallback)


    // events to show/hide qrcodes, those events are run locally, and broadcasted
    const qrcodeView = new QRCodeView(this.deck)
    this.deck.on('qrcode-show', postEventCallback)
    this.deck.on('qrcode-hide', postEventCallback)
    this.deck.on('qrcode-show', () => qrcodeView.show())
    this.deck.on('qrcode-hide', () => qrcodeView.hide())

    console.log('Initialized multiplexing')
  }

}
