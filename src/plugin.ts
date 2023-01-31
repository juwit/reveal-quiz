import quizService from './service/quizService'

import { Deck } from './view/deck'
import { initMultiplex } from './multiplex'
import { Role } from './model/quiz'
import QuizView from './view/quizView'

let deck: Deck;

function init(param: Deck) {
    deck = param;

    // findout the role for the current presentation
    const params = new URL(window.location.toString()).searchParams;
    const role = params.get('role') as Role;
    const isTrainee = role === Role.TRAINEE;
    const isTrainer = role === Role.TRAINER || role === Role.ADMIN;

    const quiz = quizService.loadOrCreateQuiz(deck, role);
    const quizView = new QuizView(quiz, deck);
    quizView.init();

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
        deck.on('quiz-question-answered', () => {
            console.log('received event questionAnswered')
            deck.dispatchEvent({
                type: 'quiz-show-responses',
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
