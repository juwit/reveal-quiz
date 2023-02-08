import TrainingSession from '../../src/model/trainingSession'
import { Question } from '../../src/model/question'
import { Quiz, Trainee } from '../../src/model/quiz'
import { expect } from 'chai'

import {randomUUID} from 'crypto'

describe('model/trainingSession', () => {
  it('should gather trainee responses', () => {

    const markdown = `
      # Who is Darth Sidious master ?
      - [ ] Darth Bane
      - [ ] Darth Tenebrous
      - [x] Darth Plagueis
      > "Did you ever hear the Tragedy of Darth Plagueis the Wise?"
      > - Sheev Palpatine, to Anakin Skywalker
    `
    const parsedQuestion = Question.fromMarkdown(markdown)
    const quiz = new Quiz()
    quiz.questions.push(parsedQuestion)

    const trainingSession = new TrainingSession(quiz)

    const john = new Trainee(randomUUID())
    const johnQuestion = Question.fromMarkdown(markdown)
    johnQuestion.answers[2].selected = true

    const jack = new Trainee(randomUUID())
    const jackQuestion = Question.fromMarkdown(markdown)
    jackQuestion.answers[1].selected = true

    trainingSession.addAnswer(john, johnQuestion)
    trainingSession.addAnswer(jack, jackQuestion)

    expect(trainingSession.traineeSessions).to.have.lengthOf(2)
    expect(trainingSession.traineeSessions[0].trainee).to.equal(john)

    expect(trainingSession.traineeSessions[1].trainee).to.equal(jack)
  })

  it('should count trainee responses for each question', () => {

    const markdown = `
      # Who is Darth Sidious master ?
      - [ ] Darth Bane
      - [ ] Darth Tenebrous
      - [x] Darth Plagueis
      > "Did you ever hear the Tragedy of Darth Plagueis the Wise?"
      > - Sheev Palpatine, to Anakin Skywalker
    `
    const parsedQuestion = Question.fromMarkdown(markdown)
    const quiz = new Quiz()
    quiz.questions.push(parsedQuestion)

    const trainingSession = new TrainingSession(quiz)

    const john = new Trainee(randomUUID())
    const johnQuestion = Question.fromMarkdown(markdown)
    johnQuestion.answers[2].selected = true

    trainingSession.addAnswer(john, johnQuestion)

    expect(quiz.questions[0].answers[0].traineeAnswersSelected).to.equal(0)
    expect(quiz.questions[0].answers[1].traineeAnswersSelected).to.equal(0)
    expect(quiz.questions[0].answers[2].traineeAnswersSelected).to.equal(1)
  })
})
