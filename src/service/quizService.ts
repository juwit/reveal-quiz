import {Quiz, Role} from '../model/quiz.js';
import {Deck} from '../view/deck.js';
import {Question} from '../model/question.js';
import {Answer} from '../model/answer.js';

export interface QuizService{
    loadOrCreateQuiz(deck: Deck, role: Role): Quiz;
    buildQuizzFromSlides(deck: Deck): Quiz;
}

class QuizServiceImpl implements QuizService{

    /**
     * loads the quiz from the local database, or create it from the slides
     */
    loadOrCreateQuiz(deck: Deck, role: Role): Quiz{
        // look in sessionStorage
        const storage = window.sessionStorage;
        const savedQuiz = storage.getItem('quiz');

        let quiz;
        if (savedQuiz !== null) {
            console.log('Loading the quiz from the session storage.');
            const jsonQuiz = JSON.parse(savedQuiz);
            // add prototypes to objects (sad)
            Object.setPrototypeOf(jsonQuiz, Quiz.prototype);
            jsonQuiz.questions.forEach(question => {
                Object.setPrototypeOf(question, Question.prototype);
                question.answers.forEach(answer => Object.setPrototypeOf(answer, Answer.prototype));
            });
            quiz = jsonQuiz;
        }
        else{
            console.log('Loading the quiz from the slides markdown.');
            quiz = this.buildQuizzFromSlides(deck);
            quiz.role = role;
        }
        // listen to events to save the quiz when needed
        deck.on('questionAnswered', () => {
            console.log('Saving quiz data to sessionStorage');
            storage.setItem('quiz', JSON.stringify(quiz));
        });
        return quiz;
    }

    buildQuizzFromSlides(deck: Deck): Quiz {
        console.log('First time loading the Quiz, loading from the Markdown');
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
