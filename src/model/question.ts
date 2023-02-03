import { Answer } from './answer'

export class Question {
  id: number
  readonly text: string
  readonly answers: Answer[]
  private answered: boolean = false
  readonly explanation: string

  private constructor (text: string, answers: Answer[], explanation: string) {
    this.text = text
    this.answers = answers
    this.explanation = explanation
  };

  /**
   * parses markdown content to a question.
   * the first line is the question text, and should be marked with a markdown title '#'.
   * lines marked with '- [ ]' or '- [x]' are either incorrect or correct answers.
   * lines markes with '>' are the explanation of the answer (if any).
   * @param markdown
   */
  static fromMarkdown (markdown: string): Question {
    const lines = markdown.split('\n').map(it => it.trim()).filter(it => it.length !== 0)
    console.log(lines)
    const questionText = lines[0].slice(2)
    const answers = lines.slice(1).filter(it => it.startsWith('-')).map(it => Answer.fromMarkdown(it))
    const explanation = lines
      .filter(it => it.startsWith('>'))
      .map(it => it.slice(1).trim())
      .join('\n')
    return new Question(questionText, answers, explanation)
  }

  answer () {
    this.answered = true
  }

  isAnswered () {
    return this.answered
  }
}
