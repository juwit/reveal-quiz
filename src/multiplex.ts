import { Deck } from './view/deck'

import { io } from 'socket.io-client/dist/socket.io.js'
import { Quiz, Role, Trainee } from './model/quiz'

import notificationService from './service/notificationService'
import { Question } from './model/question'
import {TrainingSession} from './model/trainingSession'
import QRCodeView from './view/trainer/qrcodeView'

export interface MultiplexConfig {
  role: Role;
  presentationSocketUrl: string;
}

interface Socket {
  on (eventName: string, callback: (event: any) => void): void;

  emit (eventName: string, message: { state: any }): void

  emit (eventName: string, message: { event: { type: string; data: any; } }): void
}

let deck: Deck

function initTraineeMultiplex (config: MultiplexConfig, quiz: Quiz) {
  // setting lock/unlock events
  deck.on('quiz-lock', () => {
    deck.configure({
      controls: false,
      keyboard: false,
    })
  })
  deck.on('quiz-unlock', () => {
    deck.configure({
      controls: true,
      keyboard: true,
    })
  })
  deck.on('quiz-reset', () => {
    quiz.reset()
  })

  const socket: Socket = io(config.presentationSocketUrl+'/trainee')
  socket.on('connect', () => {
    console.log('Connected to multiplex engine as a client')
    notificationService.info('Connected to multiplex engine as a client')
    deck.dispatchEvent({
      type: 'quiz-lock',
      data: {}
    })
  })
  socket.on('connect_error', (err) => {
    console.log('Unable to connect to multiplex engine')
    notificationService.warn('Unable to connect to multiplex engine')
    deck.dispatchEvent({
      type: 'quiz-unlock',
      data: {}
    })
  })

  socket.on('broadcast', function (message) {
    if (message.state) {
      deck.setState(message.state)
    }
    if (message.event) {
      deck.dispatchEvent(message.event)
    }
  })
  socket.emit('user-connected', {
    event: {
      type: 'user-connected',
      data: quiz.trainee
    }
  })

  // for trainees, when a question is answered, the result should be send to the trainer (for scoring)
  deck.on('quiz-question-answered', (question) => {
    const messageData = {
      event: {
        type: 'quiz-question-answered',
        trainee: quiz.trainee,
        data: question,
      },
    }
    socket.emit('quiz-question-answered', messageData)
  })
}

function initTrainerMultiplex (config: MultiplexConfig, quiz: Quiz) {
  const socket: Socket = io(config.presentationSocketUrl+'/admin')
  socket.on('connect', () => {
    console.log('Connected to multiplex engine as a presenter')
    notificationService.info('Connected to multiplex engine as presenter')
  })
  socket.on('connect_error', (err) => {
    console.log('Unable to connect to multiplex engine')
    notificationService.warn('Unable to connect to multiplex engine')
  })

  TrainingSession.init(quiz)
  socket.on('trainee-quiz-question-answered', (message) => {
    const {trainee, data} = message.event
    Object.setPrototypeOf(trainee, Trainee.prototype)
    Object.setPrototypeOf(data, Question.prototype)
    console.log(`Receiving answer for trainee ${trainee.id}`)
    TrainingSession.instance.addAnswer(trainee, data)
  })
  socket.on('user-connected', (message) => {
    const {trainee} = message.event
    Object.setPrototypeOf(trainee, Trainee.prototype)
    console.log(`Receiving connection for trainee ${trainee.id}`)
    TrainingSession.instance.addTrainee(trainee)
  })

  const qrcodeView = new QRCodeView(deck)
  socket.on('qrcode-show', () => {
    console.log('qrcode-show')
    qrcodeView.show()
  });
  socket.on('qrcode-hide', () => {
    console.log('qrcode-hide')
    qrcodeView.hide()
  });

  function postState () {
    const messageData = {
      state: deck.getState()
    }
    console.log('sending message ', messageData)
    socket.emit('broadcast', messageData)
  }

  function postEvent (event) {
    const messageData = {
      event: {
        type: event.type,
        data: event.data
      }
    }
    console.log('sending message ', messageData)
    socket.emit('broadcast', messageData)
  }

  // Monitor events that trigger a change in state
  deck.on('slidechanged', postState)
  deck.on('fragmentshown', postState)
  deck.on('fragmenthidden', postState)
  deck.on('overviewhidden', postState)
  deck.on('overviewshown', postState)
  deck.on('paused', postState)
  deck.on('resumed', postState)

  // Monitor events that should be broadcasted to other presentations
  deck.on('quiz-show-responses', postEvent)
  deck.on('quiz-lock', postEvent)
  // on locking, also send state to force users to current slide
  deck.on('quiz-lock', postState)
  deck.on('quiz-unlock', postEvent)
  deck.on('quiz-reset', postEvent)
  // events to show/hide qrcodes
  deck.on('qrcode-show', postEvent)
  deck.on('qrcode-hide', postEvent)

  console.log('Initialized multiplexing')
}

export function initMultiplex (deckParam: Deck, quiz: Quiz, config: MultiplexConfig) {
  deck = deckParam
  console.log(config)
  if (config.role === Role.TRAINEE) {
    initTraineeMultiplex(config, quiz)
  }
  if (config.role === Role.TRAINER || config.role === Role.ADMIN) {
    initTrainerMultiplex(config, quiz)
  }
}
