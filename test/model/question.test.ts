import { Question } from '../../src/model/question'
import * as chai from 'chai'

const expect = chai.expect

describe('model/question', () => {
  it('should parse markdown questions', () => {
    const markdown = `
      # Who is Darth Sidious master ?
      - [ ] Darth Bane
      - [ ] Darth Tenebrous
      - [x] Darth Plagueis
      > "Did you ever hear the Tragedy of Darth Plagueis the Wise?"
      > - Sheev Palpatine, to Anakin Skywalker
    `
    const parsedQuestion = Question.fromMarkdown(markdown)

    expect(parsedQuestion.text).to.equal('Who is Darth Sidious master ?')
    expect(parsedQuestion.explanation).to.equal(
      `"Did you ever hear the Tragedy of Darth Plagueis the Wise?"
- Sheev Palpatine, to Anakin Skywalker`
    )

    expect(parsedQuestion.answers).to.have.lengthOf(3)

    const [bane, tenebrous, plagueis] = parsedQuestion.answers

    expect(bane.text).to.equal('Darth Bane')
    expect(bane.correct).to.be.false

    expect(tenebrous.text).to.equal('Darth Tenebrous')
    expect(tenebrous.correct).to.be.false

    expect(plagueis.text).to.equal('Darth Plagueis')
    expect(plagueis.correct).to.be.true
  })

  it('should parse markdown questions without explanation', () => {
    const markdown = `
      # Who is Darth Sidious master ?
      - [ ] Darth Bane
      - [ ] Darth Tenebrous
      - [x] Darth Plagueis
    `
    const parsedQuestion = Question.fromMarkdown(markdown)

    expect(parsedQuestion.text).to.equal('Who is Darth Sidious master ?')
    expect(parsedQuestion.explanation).to.equal('')
  })

  it('should give an id to each answer', () => {
    const markdown = `
      # Who is Darth Sidious master ?
      - [ ] Darth Bane
      - [ ] Darth Tenebrous
      - [x] Darth Plagueis
    `
    const parsedQuestion = Question.fromMarkdown(markdown)

    expect(parsedQuestion.answers[0].id).to.equal(0)
    expect(parsedQuestion.answers[1].id).to.equal(1)
    expect(parsedQuestion.answers[2].id).to.equal(2)
  })

  it('should be answered when marked so', () => {
    const markdown = `
      # Who is Darth Sidious master ?
      - [ ] Darth Bane
      - [ ] Darth Tenebrous
      - [x] Darth Plagueis
      > "Did you ever hear the Tragedy of Darth Plagueis the Wise?"
      > - Sheev Palpatine, to Anakin Skywalker
    `
    const parsedQuestion = Question.fromMarkdown(markdown)

    expect(parsedQuestion.isAnswered()).to.be.false

    parsedQuestion.answer()

    expect(parsedQuestion.isAnswered()).to.be.true
  })

  it('should give one point for a good one-choice answer', () => {
    const markdown = `
      # Who is Darth Sidious master ?
      - [ ] Darth Bane
      - [ ] Darth Tenebrous
      - [x] Darth Plagueis
      > "Did you ever hear the Tragedy of Darth Plagueis the Wise?"
      > - Sheev Palpatine, to Anakin Skywalker
    `
    const parsedQuestion = Question.fromMarkdown(markdown)

    // select the good answer
    parsedQuestion.answers[2].selected = true
    parsedQuestion.answer()

    expect(parsedQuestion.isAnswered()).to.be.true

    expect(parsedQuestion.score()).to.equal(1)
  })

  it('should give points for a good multi-choice answer', () => {
    const markdown = `
            # Which of those ships are used by the Rebel Alliance ?
            - [x] X-Wing fighter
            - [ ] TIE Fighter
            - [x] Y-Wing
            - [x] Tantive IV
            > The TIE fighter is the signature starfighter of the Galactic Empire
        `
    const parsedQuestion = Question.fromMarkdown(markdown)

    // select the good answer
    parsedQuestion.answers[0].selected = true
    parsedQuestion.answers[2].selected = true
    parsedQuestion.answers[3].selected = true
    parsedQuestion.answer()

    expect(parsedQuestion.isAnswered()).to.be.true

    expect(parsedQuestion.score()).to.equal(3)
  })

  it('should reset all answers when told so', () => {
    const markdown = `
      # Who is Darth Sidious master ?
      - [ ] Darth Bane
      - [ ] Darth Tenebrous
      - [x] Darth Plagueis
      > "Did you ever hear the Tragedy of Darth Plagueis the Wise?"
      > - Sheev Palpatine, to Anakin Skywalker
    `
    const parsedQuestion = Question.fromMarkdown(markdown)

    // select the good answer
    parsedQuestion.answers[2].selected = true
    parsedQuestion.answer()

    // reset the question
    parsedQuestion.reset()

    expect(parsedQuestion.isAnswered()).to.be.false
    parsedQuestion.answers.forEach(it => {
      expect(it.selected).to.be.false
    })
  })
})
