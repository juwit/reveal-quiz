import { QuizConfig } from "../config/quizConfig";

interface Event {
  type: string;
  data: object;
}

export interface Deck {
  dispatchEvent (event: Event);

  getRevealElement (): HTMLElement;

  on (event: string, callback: (event?: any) => void);

  off (event: string, callback: (event?: any) => void);

  setState (state): void;

  getState (): any;

  configure (param: { keyboard: boolean; controls: boolean }): void;

  getConfig (): { quiz : QuizConfig }
}
