export interface QuizConfig {
  useTimer: boolean;
  timerDuration?: number;
}

export class DefaultQuizConfig implements QuizConfig {
  useTimer = false
  timerDuration = 60

  merge(config: QuizConfig) {
    if (config.useTimer) {
      this.useTimer = config.useTimer
    }
    if (config.timerDuration) {
      this.timerDuration = config.timerDuration
    }
  }
}