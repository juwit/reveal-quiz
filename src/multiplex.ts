import { Deck } from './view/deck'

import { io } from 'socket.io-client/dist/socket.io.js'
import { Role } from './model/quiz'

import notificationService from './service/notificationService'

export interface MultiplexConfig {
  role: Role
  presentationId: string;
  presentationSecret: string;
  presentationSocketUrl: string;
}

interface Socket {
  on (eventName: string, callback: (event: any) => void): void;

  emit (eventName: string, message: { state: any; socketId: string; secret: string; }): void

  emit (eventName: string, message: { event: { type: string; data: any; }; socketId: string; secret: string; }): void
}

let deck: Deck

function initTraineeMultiplex (config: MultiplexConfig) {
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

  const socket: Socket = io(config.presentationSocketUrl)
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

  socket.on(config.presentationId, function (message) {
    console.log(message)
    // ignore data from sockets that aren't ours
    if (message.socketId !== config.presentationId) {
      return
    }

    if (message.state) {
      deck.setState(message.state)
    }
    if (message.event) {
      deck.dispatchEvent(message.event)
    }
  })
}

function initTrainerMultiplex (config: MultiplexConfig) {
  const socket: Socket = io(config.presentationSocketUrl)
  socket.on('connect', () => {
    console.log('Connected to multiplex engine as a presenter')
    notificationService.info('Connected to multiplex engine as presenter')
  })
  socket.on('connect_error', (err) => {
    console.log('Unable to connect to multiplex engine')
    notificationService.warn('Unable to connect to multiplex engine')
  })

  function postState () {
    const messageData = {
      state: deck.getState(),
      secret: config.presentationSecret,
      socketId: config.presentationId,
    }
    console.log('sending message ', messageData)
    socket.emit('broadcast', messageData)
  }

  function postEvent (event) {
    const messageData = {
      event: {
        type: event.type,
        data: event.data
      },
      secret: config.presentationSecret,
      socketId: config.presentationId,
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

  console.log('Initialized multiplexing')
}

export function initMultiplex (deckParam: Deck, config: MultiplexConfig) {
  deck = deckParam
  console.log(config)
  if (config.role === Role.TRAINEE) {
    initTraineeMultiplex(config)
  }
  if (config.role === Role.TRAINER || config.role === Role.ADMIN) {
    initTrainerMultiplex(config)
  }
}
