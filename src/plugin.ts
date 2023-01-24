import {Question} from "./model/question.js";

import {TraineeQuestionView} from "./view/trainee/questionView.js";
import {TrainerQuestionView} from "./view/trainer/questionView.js";

import {Deck} from "./view/deck.js";
import initMultiplex from "./multiplex.js";

let deck: Deck;

function init(param: Deck) {
    deck = param;

    // findout the role for the current presentation
    const params = new URL(window.location.toString()).searchParams;
    const isClient = params.get('client') == "true";
    const isPresenter = params.get('presenter') == "true";

    const role = isPresenter ? 'trainer' : 'trainee';
    buildQuizzSlides(deck, role);

    if(isClient || isPresenter){
        console.log('Initializing multiplexing 🖧');
        initMultiplex(deck, {
            isClient,
            isPresenter,
            presentationId: params.get('presentationId'),
            presentationSecret: params.get('presentationSecret'),
            presentationSocketUrl: 'http://localhost:3000'
        });
    }
    
    deck.on("questionAnswered", () => {
        console.log("received event questionAnswered")
        deck.dispatchEvent({
            type: "showResponses",
            data: {}
        });
    });
    console.log('Initialized reveal-quiz 🙋');
}

function buildQuizzSlides(deck: Deck, role: string) {
    const sections = deck.getRevealElement().querySelectorAll('[data-quizz]');

    let questionId = 0;
    sections.forEach(section => {
        // @ts-ignore innerText attribute exists on HTMLElement, Typescript does not seem to recognize it
        const question = Question.fromMarkdown(section.innerText);
        question.id = questionId++;

        let questionView;
        if(role === "trainer"){
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
