import { Server } from 'socket.io';

const io = new Server(3000, {
    cors: {
        origin: "*",
        methods: "*",
    },
});

io.on( 'connection', socket => {

    socket.on('user-connected', data => {
        console.log('Another user connected !');
        // broadcasting the event
        socket.broadcast.emit('user-connected', data);
    });


    socket.on('broadcast', data => {
        console.log(`received message ${data}`);

        // checking that a secret is provided
        if (typeof data.secret == 'undefined' || data.secret == null || data.secret === '') return;

        delete data.secret;
        socket.broadcast.emit(data.socketId, data);
    });
});

