interface Deck{
}

class Answer {
    readonly text: string;
    public readonly correct: boolean;
    selected: boolean = false;
    type: string;
    private constructor(text: string, correct: boolean){
        this.text = text;
        this.correct = correct;
    };

    static correctRegex = /- \[x\] (.*)/;
    static incorrectRegex = /- \[ \] (.*)/;

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

    toggle() {
        this.selected = ! this.selected;
        console.log(`Answer ${this.text} toggled to ${this.selected}`);
    }
}

class Question{
    id: number;
    readonly text: string;
    readonly answers: Answer[];
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

class QuestionView{
    question: Question;
    section: Element;
    answerViews: AnswerView[] = [];

    constructor(question: Question, section)  {
        this.question = question;
        this.section = section;
    }

    submitQuestion(){
        console.log(`Question ${this.question.text} submitted !`);

        this.answerViews.forEach(it => it.computeState());
        console.log(this.question);
    }

    renderAnswers(form: HTMLFormElement){
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


    renderQuestion(){
        this.section.innerHTML = `
            <h1>${this.question.text}</h1>
            <form>
                <button type="button">Submit</button>
            </form>
        `;
        this.section.classList.add("reveal-quizz-question");
        const button =this.section.getElementsByTagName("button")[0];
        button.addEventListener("click", () => {
            this.submitQuestion();
        });

        const form = this.section.getElementsByTagName('form')[0];
        this.renderAnswers(form);
    }
}

class AnswerView{
    answer: Answer;
    private div: HTMLDivElement;

    constructor(answer: Answer, div: HTMLDivElement) {
        this.answer = answer;
        this.div = div;
    }

    renderAnswer(){
        this.div.classList.add("reveal-quizz-answer");
        this.div.innerHTML = `
            <input type="${this.answer.type}" name="answer" id="${this.answer.text}" />
            <label for="${this.answer.text}">${this.answer.text}</label>
        `;
    }

    computeState(){
        const input = this.div.getElementsByTagName("input")[0];
        this.answer.selected = input.checked;
    }
}

let deck: any;

function init(param: Deck) {
    deck = param;

    buildQuizzSlides();
    console.log('Initialized reveal-quiz 🙋');
}

const questionsViews: QuestionView[] = [];

function buildQuizzSlides(){
    const sections = deck.getRevealElement().querySelectorAll('[data-quizz]');
    let questionId = 0;
    sections.forEach(section => {
        const question = Question.fromMarkdown(section.innerText);
        question.id = questionId++;
        const questionView = new QuestionView(question, section);
        questionView.renderQuestion();
        questionsViews.push(questionView);
    });
}

function submitQuestion(id: number){
    const questionView = questionsViews[id];
    questionView.submitQuestion();
}

export default {
    id: 'RevealQuizz',
    init,
};
