import * as sinon from 'sinon'

import { TraineeQuestionView } from '../../../src/view/trainee/TraineeQuestionView'
import { Question } from '../../../src/model/question'

import {JSDOM} from 'jsdom';
import { DefaultQuizConfig } from '../../../src/config/quizConfig'
import { expect } from 'chai'

import { Deck } from '../../../src/view/deck'

describe('view/trainee/TraineeQuestionView', () => {
  describe('renderQuestion', () => {

    const markdown = `
        # Who is Darth Sidious master ?
        - [ ] Darth Bane
        - [ ] Darth Tenebrous
        - [x] Darth Plagueis
        > "Did you ever hear the Tragedy of Darth Plagueis the Wise?"
        > - Sheev Palpatine, to Anakin Skywalker
      `
    const question = Question.fromMarkdown(markdown)
    question.id = 1

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
    global.document = dom.window.document

    const deck = {
      on: sinon.stub(),
      off: sinon.stub(),
      dispatchEvent: sinon.stub(),
      getRevealElement: sinon.stub(),
      getState: sinon.stub(),
      setState: sinon.stub(),
      configure: sinon.stub(),
      getConfig: sinon.stub(),
    }

    const config = new DefaultQuizConfig()

    const view = new TraineeQuestionView(question, section, deck, config)
    view.renderQuestion()

    it('should render the question title', () => {
      const title: HTMLHeadingElement[] = section.getElementsByTagName('h1')
      expect(title).to.have.lengthOf(1)
      expect(title[0].textContent).to.equal('Who is Darth Sidious master ?')
    })

    it('should render the answers as form inputs', () => {
      const forms: HTMLFormElement[] = section.getElementsByTagName('form')
      expect(forms).to.have.lengthOf(1)

      const inputs: HTMLInputElement[] = section.getElementsByTagName('input')
      expect(inputs).to.have.lengthOf(3)
    })

    it('should not render the question explanation as the question is not yet answered', () => {
      const quote: HTMLQuoteElement[] = section.getElementsByTagName('blockquote')
      expect(quote).to.have.lengthOf(0)
    })

    it('should render a "Submit" button', () => {
      const button: HTMLButtonElement[] = section.getElementsByTagName('button')
      expect(button).to.have.lengthOf(1)
      expect(button[0].textContent).to.equal('Submit')
    })
  })
})
