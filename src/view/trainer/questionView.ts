import {Question} from '../../model/question';
import {TrainerAnswerView} from '../trainer/answerView';
import {Deck} from '../deck';
import QuestionView from '../questionView'

export class TrainerQuestionView implements QuestionView{
    question: Question;
    section: Element;
    answerViews: TrainerAnswerView[] = [];
    private deck: Deck;

    constructor(question: Question, section, deck: Deck) {
        this.question = question;
        this.section = section;
        this.deck = deck;

        this.section.setAttribute('data-quiz-question-id', this.question.id.toString());
    }

    show(){
        console.log(`Showing question ${this.question.text}`);
    }

    showResponses() {
        this.answerViews.forEach(it => it.showResponse());
        // send event
        this.deck.dispatchEvent({
            type: 'quiz-show-responses',
            data: {}
        });
    }

    renderAnswers(form: HTMLFormElement) {
        const multipleCorrectAnswers = this.question.answers.filter(it => it.correct).length > 1;
        const questionType = multipleCorrectAnswers ? 'checkbox' : 'radio';
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
        this.section.classList.add('reveal-quiz-question');
        const button = this.section.getElementsByTagName('button')[0];
        button.addEventListener('click', () => {
            this.showResponses();
        });

        const form = this.section.getElementsByTagName('form')[0];
        this.renderAnswers(form);

        this.section.setAttribute('data-quiz-question-id', this.question.id.toString());
    }
}
