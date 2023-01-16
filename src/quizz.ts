interface Deck{
}

class Answer {
    private readonly text: string;
    public readonly correct: boolean;
    private constructor(text: string, correct: boolean){
        this.text = text;
        this.correct = correct;
    };

    static correctRegex = /- \[x\] (\w*)/;
    static incorrectRegex = /- \[ \] (\w*)/;

    static fromMarkdown(markdown: string): Answer {
        if(this.correctRegex.test(markdown)){
            const [_, text] = this.correctRegex.exec(markdown);
            return new Answer(text, true);
        }
        else {
            const [_, text] = this.incorrectRegex.exec(markdown);
            return new Answer(text, false);
        }
    }

    toHtml(type: string = "checkbox") {
        return `
            <input type="${type}" name="answer" id="${this.text}" />
            <label for="${this.text}">${this.text}</label>
        `;
    }
}

class Question{
    protected readonly text: string;
    private readonly answers: Answer[];
    private constructor(text: string, answers: Answer[]){
        this.text = text;
        this.answers = answers;
    };

    static fromMarkdown(markdown: string): Question {
        const lines = markdown.split('\n').map(it => it.trim()).filter(it => it.length !== 0);
        console.log(lines);
        const questionText = lines[0].slice(2);
        const answers = lines.slice(1).map(it => Answer.fromMarkdown(it));

        return new Question(questionText, answers);
    }

    renderAnswers():string{
        const multipleCorrectAnswers = this.answers.filter(it => it.correct).length > 1;
        const questionType = multipleCorrectAnswers ? "checkbox" : "radio";
        return this.answers.map(it => it.toHtml(questionType)).join('\n');
    }

    toHtml(): string {
        return `
            <h1>${this.text}</h1>
            <ul>
            <form>
                ${this.renderAnswers()}
            </form>
            </ul>
        `;
    }
}

let deck: any;

function init(param: Deck) {
    console.log('Initialized reveal-quiz 🙋');
    deck = param;
    buildQuizzSlides();
}

function buildQuizzSlides(){
    const sections = deck.getRevealElement().querySelectorAll('[data-quizz]');
    const questions = [];
    sections.forEach(section => {
        const question = Question.fromMarkdown(section.innerText);
        questions.push(question);
        section.outerHTML = `
<section>
    ${question.toHtml()}
</section>
        `;
    });
    console.log(questions);
}

export default {
    id: 'RevealQuizz',
    init,
};
