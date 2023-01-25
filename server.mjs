import { Server } from 'socket.io';

const io = new Server(3000, {
    cors: {
        origin: '*',
        methods: '*',
    },
});

let lastState = null;

io.on( 'connection', socket => {

    // also send to this new user the last status so it reconnects to the good slide
    if(lastState){
        console.log('New user, sending last status');
        socket.emit(lastState.socketId, lastState);
    }

    socket.on('user-connected', data => {
        console.log('Another user connected !');
        // broadcasting the event
        socket.broadcast.emit('user-connected', data);
    });

    socket.on('broadcast', data => {
        console.log(`received message ${JSON.stringify(data)}`);

        if(data.state){
            lastState = data;
        }

        // checking that a secret is provided
        if (typeof data.secret == 'undefined' || data.secret == null || data.secret === '') return;

        delete data.secret;
        socket.broadcast.emit(data.socketId, data);
    });
});

