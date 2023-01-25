import {Question} from "./model/question.js";

import {TraineeQuestionView} from "./view/trainee/questionView.js";
import {TrainerQuestionView} from "./view/trainer/questionView.js";

import {Deck} from "./view/deck.js";
import {initMultiplex, Role} from "./multiplex.js";

let deck: Deck;

function init(param: Deck) {
    deck = param;

    // findout the role for the current presentation
    const params = new URL(window.location.toString()).searchParams;
    const role = params.get('role') as Role;
    const isTrainee = role === Role.TRAINEE;
    const isTrainer = role === Role.TRAINER;

    buildQuizzSlides(deck, role);

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
        deck.on("questionAnswered", () => {
            console.log("received event questionAnswered")
            deck.dispatchEvent({
                type: "showResponses",
                data: {}
            });
        });
    }
    console.log('Initialized reveal-quiz 🙋');
}

function buildQuizzSlides(deck: Deck, role: Role) {
    const sections = deck.getRevealElement().querySelectorAll('[data-quiz]');

    let questionId = 0;
    sections.forEach(section => {
        // @ts-ignore innerText attribute exists on HTMLElement, Typescript does not seem to recognize it
        const question = Question.fromMarkdown(section.innerText);
        question.id = questionId++;

        let questionView;
        if(role === Role.TRAINER){
            questionView = new TrainerQuestionView(question, section, deck);
        }
        else {
            questionView = new TraineeQuestionView(question, section, deck);
        }
        questionView.renderQuestion();
    });
}

export default {
    id: 'RevealQuizz',
    init,
};
