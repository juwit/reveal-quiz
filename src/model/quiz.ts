import { Question } from './question'

export enum Role {
  TRAINER = 'trainer',
  TRAINEE = 'trainee',
  ADMIN = 'admin',
}

export class Trainee {
  id: string = crypto.randomUUID()
}

export class Quiz {
  questions: Question[] = []
  role: Role
  trainee?: Trainee
}
