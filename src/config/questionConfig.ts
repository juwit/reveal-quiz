import { QuizConfig } from "./quizConfig";

/**
 * Reads a configuration from a slide, that can override global configuration
 */
export default class QuestionConfig implements QuizConfig {
  timerDuration: number = 60
  useTimer: boolean = false
  randomizeAnswers: boolean = false

  constructor (section: Element, globalConfig: QuizConfig) {
    this.mergeGlobalConfiguration(globalConfig)
    this.loadDataAttributes(section)
  }

  private mergeGlobalConfiguration(globalConfig: QuizConfig){
    if(globalConfig.useTimer){
      this.useTimer = globalConfig.useTimer
    }
    if(globalConfig.timerDuration){
      this.timerDuration = globalConfig.timerDuration
    }
    if(globalConfig.randomizeAnswers){
      this.randomizeAnswers = globalConfig.randomizeAnswers
    }
  }

  private loadDataAttributes (section: Element) {
    const useTimer = section.getAttribute('data-quiz-config-useTimer')
    if(useTimer){
      this.useTimer = useTimer === 'true'
    }

    const timerDuration = section.getAttribute('data-quiz-config-timerDuration')
    if(timerDuration){
      this.timerDuration = parseInt(timerDuration)
    }

    const randomizeAnswers = section.getAttribute('data-quiz-config-randomizeAnswers')
    if(randomizeAnswers){
      this.randomizeAnswers = randomizeAnswers === 'true'
    }
  }
}
