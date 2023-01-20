export class Answer {
    readonly text: string;
    public readonly correct: boolean;
    selected: boolean = false;
    type: string;

    private constructor(text: string, correct: boolean) {
        this.text = text;
        this.correct = correct;
    };

    static correctRegex = /- \[x\] (.*)/;
    static incorrectRegex = /- \[ \] (.*)/;

    static fromMarkdown(markdown: string): Answer {
        if (this.correctRegex.test(markdown)) {
            const [_, text] = this.correctRegex.exec(markdown);
            return new Answer(text, true);
        } else {
            const [_, text] = this.incorrectRegex.exec(markdown);
            return new Answer(text, false);
        }
    }
}