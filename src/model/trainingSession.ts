import { Quiz, Trainee } from './quiz'
import { Question } from './question'

class TraineeSession {
  readonly trainee: Trainee
  questions: Question[] = []

  constructor (trainee: Trainee) {
    this.trainee = trainee
  }

  addQuestionAnswer (question: Question) {
    this.questions.push(question)
  }
}

export class TrainingSession {

  private readonly quiz: Quiz

  traineeSessions: TraineeSession[] = []

  static instance : TrainingSession

  constructor (quiz: Quiz) {
    this.quiz = quiz
  }

  addAnswer (trainee: Trainee, traineeQuestion: Question) {
    this.findTraineeSessionOrCreate(trainee).addQuestionAnswer(traineeQuestion)
    const quizQuestion = this.quiz.getQuestion(traineeQuestion.id)
    traineeQuestion.answers.forEach(traineeAnswer => {
      if(traineeAnswer.selected){
        const quizAnswer = quizQuestion.answers.find(it => it.text === traineeAnswer.text)
        quizAnswer.traineeAnswersSelected++
      }
    })
  }

  private findTraineeSessionOrCreate (trainee: Trainee): TraineeSession {
    // find trainee or create
    let traineeSession = this.traineeSessions.find(it => it.trainee === trainee)
    if (!traineeSession) {
      traineeSession = new TraineeSession(trainee)
      this.traineeSessions.push(traineeSession)
    }
    return traineeSession
  }

  static init(quiz: Quiz): void{
    TrainingSession.instance = new TrainingSession(quiz)
  }
}
