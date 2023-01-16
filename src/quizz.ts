interface Deck{
}

class Answer {
    private text: string;
    private correct: boolean;
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
}

class Question{
    public readonly text: string;
    private answers: Answer[];
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
    <h1 class="question-text">${question.text}</h1>
</section>
        `;
    });
    console.log(questions);
}

export default {
    id: 'RevealQuizz',
    init,
};
