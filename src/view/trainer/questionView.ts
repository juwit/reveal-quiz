import {Question} from "../../model/question.js";
import {TrainerAnswerView} from "../trainer/answerView.js";
import {Deck} from "../deck.js";

export class TrainerQuestionView {
    question: Question;
    section: Element;
    answerViews: TrainerAnswerView[] = [];
    private deck: Deck;

    constructor(question: Question, section, deck: Deck) {
        this.question = question;
        this.section = section;
        this.deck = deck;
    }

    /**
     * Show the correct and incorrect responses on the question
     */
    showReponses() {
        this.answerViews.forEach(it => it.showResponse());
        // send event
        this.deck.dispatchEvent({
            type: 'showResponses',
            data: {}
        });
    }

    renderAnswers(form: HTMLFormElement) {
        const multipleCorrectAnswers = this.question.answers.filter(it => it.correct).length > 1;
        const questionType = multipleCorrectAnswers ? "checkbox" : "radio";
        this.question.answers.forEach(it => it.type = questionType);

        this.question.answers.forEach(it => {
            const div = document.createElement('div');
            form.append(div);
            const view = new TrainerAnswerView(it, div);
            view.renderAnswer();
            this.answerViews.push(view);
        });
    }

    renderQuestion() {
        this.section.innerHTML = `
            <h1>${this.question.text}</h1>
            <form>
                <button type="button">Show responses</button>
            </form>
        `;
        this.section.classList.add("reveal-quiz-question");
        const button = this.section.getElementsByTagName("button")[0];
        button.addEventListener("click", () => {
            this.showReponses();
        });

        const form = this.section.getElementsByTagName('form')[0];
        this.renderAnswers(form);
    }
}
