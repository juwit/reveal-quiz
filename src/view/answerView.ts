import {Answer} from "../model/answer";

/**
 * Represents the view for an answer, basically a simple checkbox or radio button in a form.
 * This view is responsible for rendering in a given HTMLElement.
 */
export interface AnswerView {

    /**
     * Renders the answer as a checkbox or a radio button, in order to be able to select it as a user.
     */
    renderAnswer(): void;

    /**
     * Computes the state of the current view, to pass it to the underlying answer.
     * If the checkbox is checked, the answer should be selected.
     */
    computeState(): void;

    /**
     * Locks the current answer, so the user should not be able to select it.
     */
    lock(): void;

    /**
     * Renders the answer as a response.
     * If the user selected the answer, and the answer is correct, it is expected to render in green, in red otherwise.
     */
    showResponse(): void;
}

export abstract class AbstractAnswerView implements AnswerView {
    protected answer: Answer;
    protected div: HTMLDivElement;

    protected constructor(answer: Answer, div: HTMLDivElement) {
        this.answer = answer;
        this.div = div;
    }

    renderAnswer() {
        this.div.classList.add('reveal-quiz-answer');
        this.div.innerHTML = `
            <input type="${this.answer.type}" name="answer" id="${this.answer.text}" />
            <label for="${this.answer.text}">${this.answer.text}</label>
        `;
    }

    computeState() {
        const input = this.div.getElementsByTagName('input')[0];
        this.answer.selected = input.checked;
    }

    lock() {
        const input = this.div.getElementsByTagName('input')[0];
        input.classList.add('locked');
        input.disabled = true;
    }

    abstract showResponse(): void;
}