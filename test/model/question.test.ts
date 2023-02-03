import { Question } from '../../src/model/question';
import * as chai from 'chai'
const expect = chai.expect;

describe('model/question', () => {
  it('should parse markdown questions', () => {
    const markdown = `
      # Who is Darth Sidious master ?
      - [ ] Darth Bane
      - [ ] Darth Tenebrous
      - [x] Darth Plagueis
    `;
    const parsedQuestion = Question.fromMarkdown(markdown);

    expect(parsedQuestion.text).to.equal('Who is Darth Sidious master ?');

    expect(parsedQuestion.answers).to.have.lengthOf(3);

    const [bane, tenebrous, plagueis] = parsedQuestion.answers;

    expect(bane.text).to.equal('Darth Bane');
    expect(bane.correct).to.be.false;

    expect(tenebrous.text).to.equal('Darth Tenebrous');
    expect(tenebrous.correct).to.be.false;

    expect(plagueis.text).to.equal('Darth Plagueis');
    expect(plagueis.correct).to.be.true;
  });

  it('should be answered when marked so', () => {
    const markdown = `
      # Who is Darth Sidious master ?
      - [ ] Darth Bane
      - [ ] Darth Tenebrous
      - [x] Darth Plagueis
    `;
    const parsedQuestion = Question.fromMarkdown(markdown);

    expect(parsedQuestion.isAnswered()).to.be.false;

    parsedQuestion.answer();

    expect(parsedQuestion.isAnswered()).to.be.true;
  });
});
