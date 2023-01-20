import {Answer} from "./model/answer.js";
import {Question} from "./model/question.js";

interface Event {
    type: string;
    data: object;
}

interface Deck {
    dispatchEvent(event: Event);

    getRevealElement(): HTMLElement;

    on(event: string, callback: () => void);

    off(event: string, callback: () => void);
}

class QuestionView {
    question: Question;
    section: Element;
    answerViews: AnswerView[] = [];

    constructor(question: Question, section) {
        this.question = question;
        this.section = section;
    }

    submitQuestion() {
        console.log(`Question ${this.question.text} submitted !`);

        this.answerViews.forEach(it => it.computeState());

        // lock the question to disallow futher answers
        this.answerViews.forEach(it => it.lock());

        // remove submit button
        this.section.getElementsByTagName("button")[0].remove();

        const showResponseCallback = () => {
            console.log("received event showResponses")
            this.showReponses();
            deck.off("showResponses", showResponseCallback);
        };
        deck.on("showResponses", showResponseCallback);

        deck.dispatchEvent({type: "questionAnswered", data: this.question});
    }

    /**
     * Show the correct and incorrect responses on the question
     */
    showReponses() {
        this.answerViews.forEach(it => it.showResponse());
    }

    renderAnswers(form: HTMLFormElement) {
        const multipleCorrectAnswers = this.question.answers.filter(it => it.correct).length > 1;
        const questionType = multipleCorrectAnswers ? "checkbox" : "radio";
        this.question.answers.forEach(it => it.type = questionType);

        this.question.answers.forEach(it => {
            const div = document.createElement('div');
            form.append(div);
            const view = new AnswerView(it, div);
            view.renderAnswer();
            this.answerViews.push(view);
        });
    }

    renderQuestion() {
        this.section.innerHTML = `
            <h1>${this.question.text}</h1>
            <form>
                <button type="button">Submit</button>
            </form>
        `;
        this.section.classList.add("reveal-quizz-question");
        const button = this.section.getElementsByTagName("button")[0];
        button.addEventListener("click", () => {
            this.submitQuestion();
        });

        const form = this.section.getElementsByTagName('form')[0];
        this.renderAnswers(form);
    }
}

class AnswerView {
    answer: Answer;
    private div: HTMLDivElement;

    constructor(answer: Answer, div: HTMLDivElement) {
        this.answer = answer;
        this.div = div;
    }

    renderAnswer() {
        this.div.classList.add("reveal-quizz-answer");
        this.div.innerHTML = `
            <input type="${this.answer.type}" name="answer" id="${this.answer.text}" />
            <label for="${this.answer.text}">${this.answer.text}</label>
        `;
    }

    computeState() {
        const input = this.div.getElementsByTagName("input")[0];
        this.answer.selected = input.checked;
    }

    lock() {
        const input = this.div.getElementsByTagName("input")[0];
        input.classList.add("locked");
        input.disabled = true;
    }

    showResponse() {
        console.log(this.answer);
        // selected correct answer
        if (this.answer.correct && this.answer.selected) {
            this.div.classList.add("correct");
        }
        // not selected correct answer
        if (this.answer.correct && !this.answer.selected) {
            this.div.classList.add("incorrect");
        }
        // selected incorrect answer
        if (!this.answer.correct && this.answer.selected) {
            this.div.classList.add("incorrect");
        }
    }
}

let deck: Deck;

function init(param: Deck) {
    deck = param;
    buildQuizzSlides();

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

function buildQuizzSlides() {
    const sections = deck.getRevealElement().querySelectorAll('[data-quizz]');
    let questionId = 0;
    sections.forEach(section => {
        // @ts-ignore innerText attribute exists on HTMLElement, Typescript does not seem to recognize it
        const question = Question.fromMarkdown(section.innerText);
        question.id = questionId++;
        const questionView = new QuestionView(question, section);
        questionView.renderQuestion();
        questionsViews.push(questionView);
    });
}

export default {
    id: 'RevealQuizz',
    init,
};
