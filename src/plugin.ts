import quizService from './service/quizService.js';

import {Deck} from './view/deck.js';
import {initMultiplex} from './multiplex.js';
import {Role} from './model/quiz.js';
import {initQuizView} from './view/quizView.js';

let deck: Deck;

function init(param: Deck) {
    deck = param;

    // findout the role for the current presentation
    const params = new URL(window.location.toString()).searchParams;
    const role = params.get('role') as Role;
    const isTrainee = role === Role.TRAINEE;
    const isTrainer = role === Role.TRAINER;

    const quiz = quizService.loadOrCreateQuiz(deck, role);
    initQuizView(quiz, deck);

    if(isTrainee || isTrainer){
        console.log('Initializing multiplexing 🖧');
        initMultiplex(deck, {
            role,
            presentationId: params.get('presentationId'),
            presentationSecret: params.get('presentationSecret'),
            presentationSocketUrl: 'http://localhost:3000'
        });
    }

    // for autonomous readers, directly answer the question
    if(!isTrainee && !isTrainer){
        deck.on('questionAnswered', () => {
            console.log('received event questionAnswered')
            deck.dispatchEvent({
                type: 'showResponses',
                data: {}
            });
        });
    }
    console.log('Initialized reveal-quiz 🙋');
}

export default {
    id: 'RevealQuizz',
    init,
};
