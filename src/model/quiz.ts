import { Question } from './question'

export enum Role {
  TRAINER = 'trainer',
  TRAINEE = 'trainee',
  ADMIN = 'admin',
}

export class Trainee {
  private readonly id: string

  constructor (id: string) {
    this.id = id
  }
}

export class Quiz {
  questions: Question[] = []
  role: Role
  trainee?: Trainee

  reset () {
    this.questions.forEach(it => it.reset())
  }

  getQuestion (id: number): Question {
    return this.questions.find(it => it.id === id)
  }
}
