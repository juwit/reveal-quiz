export interface QuizConfig {
  useTimer: boolean;
  timerDuration?: number;
  randomizeAnswers: boolean;
}

export class DefaultQuizConfig implements QuizConfig {
  useTimer = false
  timerDuration = 60
  randomizeAnswers = false

  merge(config: QuizConfig) {
    if (config.useTimer) {
      this.useTimer = config.useTimer
    }
    if (config.timerDuration) {
      this.timerDuration = config.timerDuration
    }
    if(config.randomizeAnswers){
      this.randomizeAnswers = config.randomizeAnswers
    }
  }
}