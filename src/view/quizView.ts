import {Deck} from './deck';
import {Quiz, Role} from '../model/quiz';
import {TrainerQuestionView} from './trainer/questionView';
import {TraineeQuestionView} from './trainee/questionView';

export function initQuizView(quiz: Quiz, deck: Deck){
    const sections = deck.getRevealElement().querySelectorAll('[data-quiz]');

    quiz.questions.forEach(question => {
        let questionView;
        if(quiz.role === Role.TRAINER){
            questionView = new TrainerQuestionView(question, sections[question.id], deck);
        }
        else {
            questionView = new TraineeQuestionView(question, sections[question.id], deck);
        }
        questionView.renderQuestion();
        if(question.isAnswered()){
            questionView.showReponses();
        }
    })
}
