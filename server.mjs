import { Server } from 'socket.io'

const io = new Server(3000, {
  cors: {
    origin: '*',
    methods: '*',
  },
})

let lastState = null

const adminEvents = ['qrcode-show', 'qrcode-hide']

const adminNamespace = io.of('/admin')
const trainerNamespace = io.of('/trainer')
const traineeNamespace = io.of('/trainee')

// admin namespace
adminNamespace.on('connection', socket => {
  console.log('Received connection to admin namespace')

  // admin can broadcast events to trainees
  socket.on('broadcast', data => {
    console.log(`Received message in admin: ${JSON.stringify(data)}`)

    if (data.state) {
      lastState = data
      // state is broadcasted from the admin to the presenter and to the trainees
      trainerNamespace.emit('broadcast', data)
      traineeNamespace.emit('broadcast', data)
      return
    }

    if(adminEvents.includes(data.event.type)){
      // admin events are broadcasted to the trainer view only
      trainerNamespace.emit(data.event.type, data)
      return
    }

    // other events are only broadcasted to the trainees
    traineeNamespace.emit('broadcast', data)
  })
})

// trainer namespace
trainerNamespace.on('connection', socket => {
  console.log('Received connection to trainer namespace')

  // trainer can broadcast state events to trainees and admin
  socket.on('broadcast', data => {
    console.log(`Received message in trainer: ${JSON.stringify(data)}`)

    if (data.state) {
      lastState = data
      // state is broadcasted from the admin to the presenter and to the trainees
      adminNamespace.emit('broadcast', data)
      traineeNamespace.emit('broadcast', data)
    }
  })
})

// trainees namespace
traineeNamespace.on('connection', socket => {
  console.log('Received connection to trainee namespace')
  // send the last status so the trainee reconnects to the good slide
  if (lastState) {
    console.log('New user, sending last status')
    socket.emit('broadcast', lastState)
  }

  // sending the new trainee information to the admin
  socket.on('user-connected', data => {
    console.log(`Received message in trainee: ${JSON.stringify(data)}`)
    adminNamespace.emit('user-connected', data)
  })

  // receiving trainees answers
  socket.on('quiz-question-answered', data => {
    console.log(`Received message in trainee: ${JSON.stringify(data)}`)
    // sending the answer to the admin
    adminNamespace.emit('trainee-quiz-question-answered', data)
  })
})
