import { Deck } from './deck'
import { Quiz, Role } from '../model/quiz'
import { TrainerQuestionView } from './trainer/questionView'
import { TraineeQuestionView } from './trainee/questionView'
import AdminView from './adminView'
import QuestionView from './questionView'

export default class QuizView{
    private readonly quiz: Quiz
    private readonly deck: Deck
    private questionViews: QuestionView[] = [];

    constructor (quiz: Quiz, deck: Deck) {
        this.quiz = quiz;
        this.deck = deck;
    }

    init(){
        const sections = this.deck.getRevealElement().querySelectorAll('[data-quiz]');

        if(this.quiz.role === Role.ADMIN) {
            // add the admin component
            const adminView = new AdminView(this.deck);
            adminView.render();
        }

        this.quiz.questions.forEach(question => {
            let questionView;
            if(this.quiz.role === Role.TRAINER || this.quiz.role === Role.ADMIN){
                questionView = new TrainerQuestionView(question, sections[question.id], this.deck);
            }
            else {
                questionView = new TraineeQuestionView(question, sections[question.id], this.deck);
            }
            questionView.renderQuestion();
            if(question.isAnswered()){
                questionView.showReponses();
            }
            this.questionViews.push(questionView);
        });

        this.deck.on('slidechanged', event => {
            // get question of current slide
            const slideSection = event.currentSlide;
            const questionId = slideSection.getAttribute('data-quiz-question-id');
            if(questionId !== null){
                // slide holds a question, otherwise its a simple slide
                const questionView = this.questionViews[questionId];
                questionView.show();
            }
        });
    }
}
