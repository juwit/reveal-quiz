import {Answer} from "./answer.js";

export class Question {
    id: number;
    readonly text: string;
    readonly answers: Answer[];
    private answered: boolean = false;

    private constructor(text: string, answers: Answer[]) {
        this.text = text;
        this.answers = answers;
    };

    answer(){
        this.answered = true;
    }

    static fromMarkdown(markdown: string): Question {
        const lines = markdown.split('\n').map(it => it.trim()).filter(it => it.length !== 0);
        console.log(lines);
        const questionText = lines[0].slice(2);
        const answers = lines.slice(1).map(it => Answer.fromMarkdown(it));

        return new Question(questionText, answers);
    }

    isAnswered() {
        return this.answered;
    }
}
