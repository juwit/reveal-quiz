import { Deck } from './deck'
import { Quiz, Role } from '../model/quiz'
import { TrainerQuestionView } from './trainer/questionView'
import { TraineeQuestionView } from './trainee/questionView'
import AdminView from './adminView'

export default class QuizView{
    private quiz: Quiz
    private deck: Deck

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
        });
    }
}
