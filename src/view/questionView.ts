export default interface QuestionView {
  /**
   * Shows the QuestionView.
   * Should be called when the slide is shown.
   */
  show (): void;

  /**
   * Shows the correct and incorrect responses of the question.
   */
  showResponses (): void;

  renderAnswers (form: HTMLFormElement): void;

  /**
   * Renders the question, by displaying the question and the available answers.
   */
  renderQuestion (): void;

  /**
   * Resets the question view back to its initial state.
   * All the components are destroyed and re-created
   */
  reset(): void;
}
