import {DefaultQuizConfig} from "../../src/config/quizConfig";
import QuestionConfig from "../../src/config/questionConfig";

import {JSDOM} from 'jsdom';
import {expect} from "chai";

describe('config/questionConfig', () => {
  it('should override QuizConfig', () => {
    const quizConfig = new DefaultQuizConfig();
    quizConfig.useTimer = false
    quizConfig.timerDuration = 60
    quizConfig.randomizeAnswers = true

    const sectionHtml = `
      <section 
        data-quiz 
        data-quiz-config-useTimer="true"
        data-quiz-config-timerDuration="30"
        data-quiz-config-randomizeAnswers="false"
      >
      </section>
    `

    const dom = new JSDOM(sectionHtml)
    const section = dom.window.document.querySelector('section')

    const questionConfig = new QuestionConfig(section, quizConfig)

    expect(questionConfig.useTimer).to.be.true
    expect(questionConfig.timerDuration).to.equal(30)
    expect(questionConfig.randomizeAnswers).to.be.false
  })
})