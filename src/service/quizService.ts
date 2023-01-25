import {Quiz, Role} from "../model/quiz.js";
import {Deck} from "../view/deck.js";
import {Question} from "../model/question.js";

export interface QuizService{
    loadOrCreateQuiz(deck: Deck, role: Role): Quiz;
    buildQuizzFromSlides(deck: Deck): Quiz;
}

class QuizServiceImpl implements QuizService{

    /**
     * loads the quiz from the local database, or create it from the slides
     */
    loadOrCreateQuiz(deck: Deck, role: Role): Quiz{
        const quiz = this.buildQuizzFromSlides(deck);
        quiz.role = role;
        return quiz;
    }

    buildQuizzFromSlides(deck: Deck): Quiz {
        const sections = deck.getRevealElement().querySelectorAll('[data-quiz]');

        const quiz = new Quiz();

        let questionId = 0;
        sections.forEach(section => {
            // @ts-ignore innerText attribute exists on HTMLElement, Typescript does not seem to recognize it
            const question = Question.fromMarkdown(section.innerText);
            question.id = questionId++;

            quiz.questions.push(question);
        });

        return quiz;
    }
    
}

const instance = new QuizServiceImpl();

export default instance;
