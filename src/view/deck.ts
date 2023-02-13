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

  /**
   * Tells if the deck instance has the given plugin
   * @param pluginName the name of the plugin to search
   */
  hasPlugin (pluginName: string): boolean

  /**
   * Get the plugin instance for the deck
   * @param pluginName the name of the plugin to search
   */
  getPlugin (pluginName: string): any
}
