import { Question } from './question'

import {randomUUID} from 'crypto'

export enum Role {
  TRAINER = 'trainer',
  TRAINEE = 'trainee',
  ADMIN = 'admin',
}

export class Trainee {
  id: string = randomUUID()
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
