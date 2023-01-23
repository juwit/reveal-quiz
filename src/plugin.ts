import {Question} from "./model/question.js";
import {QuestionView} from "./view/questionView.js";
import {Deck} from "./view/deck.js";
import initMultiplex from "./multiplex.js";

let deck: Deck;

function init(param: Deck) {
    deck = param;
    buildQuizzSlides(deck);

    // findout if we need to start multiplex or not
    const params = new URL(window.location.toString()).searchParams;
    const isClient = params.get('client') == "true";
    const isPresenter = params.get('presenter') == "true";
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

const questionsViews: QuestionView[] = [];

function buildQuizzSlides(deck: Deck) {
    const sections = deck.getRevealElement().querySelectorAll('[data-quizz]');
    let questionId = 0;
    sections.forEach(section => {
        // @ts-ignore innerText attribute exists on HTMLElement, Typescript does not seem to recognize it
        const question = Question.fromMarkdown(section.innerText);
        question.id = questionId++;
        const questionView = new QuestionView(question, section, deck);
        questionView.renderQuestion();
        questionsViews.push(questionView);
    });
}

export default {
    id: 'RevealQuizz',
    init,
};
