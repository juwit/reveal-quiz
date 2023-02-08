import { Server } from 'socket.io'

const io = new Server(3000, {
  cors: {
    origin: '*',
    methods: '*',
  },
})

let lastState = null

const adminNamespace = io.of('/admin')
const traineeNamespace = io.of('/trainee')

// admin namespace
adminNamespace.on('connection', socket => {
  console.log('Received connection to admin namespace')

  // admin can broadcast events to trainees
  socket.on('broadcast', data => {
    console.log(`Received message in admin: ${JSON.stringify(data)}`)

    if (data.state) {
      lastState = data
      return traineeNamespace.emit('broadcast', data)
    }

    if(adminEvents.includes(data.event.type)){
      return adminNamespace.emit(data.event.type, data)
    }
    else {
      return traineeNamespace.emit('broadcast', data)
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
