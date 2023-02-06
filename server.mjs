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
    console.log(`Received message in admin ${JSON.stringify(data)}`)

    if (data.state) {
      lastState = data
    }

    // checking that a secret is provided
    if (typeof data.secret == 'undefined' || data.secret == null || data.secret === '') return

    delete data.secret
    traineeNamespace.emit(data.socketId, data)
  })
})

// trainees namespace
traineeNamespace.on('connection', socket => {
  console.log('Received connection to trainee namespace')
  // send the last status so the trainee reconnects to the good slide
  if (lastState) {
    console.log('New user, sending last status')
    socket.emit(lastState.socketId, lastState)
  }
})
