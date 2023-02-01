import {Answer} from '../../model/answer';
import {AbstractAnswerView} from "../answerView";

export class TrainerAnswerView extends AbstractAnswerView {

    constructor(answer: Answer, div: HTMLDivElement) {
        super(answer, div);
    }

    /**
     * for a trainer, only show correct responses, as the trainer doesn't answer the question
     */
    showResponse() {
        console.log(this.answer);
        // selected correct answer
        if (this.answer.correct) {
            this.div.classList.add('correct');
        }
    }
}
