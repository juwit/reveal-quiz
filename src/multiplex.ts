import {Deck} from "./view/deck.js";

// @ts-ignore
const notie = window.notie;

interface MultiplexConfig {
    isClient: boolean;
    isPresenter: boolean;
    presentationId: string;
    presentationSecret: string;
    presentationSocketUrl: string;
}

interface Socket {
    on: (message) => void;
}

import { io } from '../node_modules/socket.io-client/dist/socket.io.esm.min.js';

let deck: Deck;

function initClientMultiplex(config: MultiplexConfig){
    const socket = io(config.presentationSocketUrl);
    socket.on("connect", () => {
        console.log("Connected to multiplex engine as a client");

        // removing controls from the deck engine
        deck.configure({
            controls: false,
            keyboard: false,
        });

        notie.alert({
            type: 'info',
            text: 'Connected to multiplex engine as a client',
        });
    });
    socket.on("connect_error", (err) => {
        console.log("Unable to connect to multiplex engine");
        // adding controls back to allow user to self navigate
        deck.configure({
            controls: true,
            keyboard: true,
        });

        notie.alert({
            type: 'warning',
            text: 'Unable to connect to multiplex engine',
        });
    });

    socket.on(config.presentationId, function(message) {
        console.log(message);
        // ignore data from sockets that aren't ours
        if (message.socketId !== config.presentationId) { return; }

        if ( message.state ) {
            deck.setState(message.state);
        }
    });
}

function initPresenterMultiplex(config: MultiplexConfig){
    const socket = io(config.presentationSocketUrl);
    socket.on("connect", () => {
        console.log("Connected to multiplex engine as a presenter");
        notie.alert({
            type: 'info',
            text: 'Connected to multiplex engine as presenter',
        });
    });
    socket.on("connect_error", (err) => {
        console.log("Unable to connect to multiplex engine");
        notie.alert({
            type: 'warning',
            text: 'Unable to connect to multiplex engine',
        });
    });

    function post( evt ) {
        const messageData = {
            state: deck.getState(),
            secret: config.presentationSecret,
            socketId: config.presentationId,
            content: (evt || {}).content
        };
        console.log('sending message ', messageData);
        socket.emit('broadcast', messageData );
    }


    // Monitor events that trigger a change in state
    deck.on( 'slidechanged', post );
    deck.on( 'fragmentshown', post );
    deck.on( 'fragmenthidden', post );
    deck.on( 'overviewhidden', post );
    deck.on( 'overviewshown', post );
    deck.on( 'paused', post );
    deck.on( 'resumed', post );

    console.log("Initialized multiplexing");
}

export default function initMultiplex(deckParam: Deck, config: MultiplexConfig){
    deck = deckParam;
    console.log(config);
    if(config.isClient){
        initClientMultiplex(config);
    }
    if(config.isPresenter){
        initPresenterMultiplex(config);
    }
}
