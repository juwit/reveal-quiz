export class Answer {
  static correctRegex = /- \[x\] (.*)/
  static incorrectRegex = /- \[ \] (.*)/

  id: number
  readonly text: string
  public readonly correct: boolean
  selected: boolean = false
  type: string
  // the number of trainee that selected this answer, used on admin view
  traineeAnswersSelected: number = 0

  private constructor (text: string, correct: boolean) {
    this.text = text
    this.correct = correct
  };

  static fromMarkdown (markdown: string): Answer {
    if (this.correctRegex.test(markdown)) {
      const [_, text] = this.correctRegex.exec(markdown)
      return new Answer(text, true)
    } else {
      const [_, text] = this.incorrectRegex.exec(markdown)
      return new Answer(text, false)
    }
  }
}
