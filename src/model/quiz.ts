import {Question} from './question';

export enum Role {
    TRAINER= 'trainer',
    TRAINEE= 'trainee',
}

export class Quiz {
    questions: Question[] = [];
    role: Role;
}
