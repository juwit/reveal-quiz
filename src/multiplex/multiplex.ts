import { Quiz, Role } from '../model/quiz'
import { Deck } from '../view/deck'
import TraineeMultiplex from './traineeMultiplex'
import TrainerMultiplex from './trainerMultiplex'

/**
 * Interface of a socket, that will be used for multiplexing
 */
export interface Socket {
  on (eventName: string, callback: (event: any) => void): void;

  emit (eventName: string, message: { state: any }): void

  emit (eventName: string, message: { event: { type: string; data: any; } }): void
}

/**
 * Configuration for the multiplex
 */
export interface MultiplexConfig {
  role: Role;
  presentationSocketUrl: string;
}

/**
 * A multiplex interface
 */
export default interface Multiplex {
  connect (): void
}

/**
 * Initialises the multiplex for the current deck
 * @param deck
 * @param quiz
 * @param config
 */
export function initMultiplex (deck: Deck, quiz: Quiz, config: MultiplexConfig) {
  if (config.role === Role.TRAINEE) {
    new TraineeMultiplex(deck, quiz, config).connect()
  }
  if (config.role === Role.TRAINER || config.role === Role.ADMIN) {
    new TrainerMultiplex(deck, quiz, config).connect()
  }
}
