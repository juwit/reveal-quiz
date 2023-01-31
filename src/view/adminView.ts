import { Deck } from './deck'

export interface AdminView{
  render(): void;
}

export default class AdminViewImpl implements AdminView{
  private reveal: HTMLElement;
  private deck: Deck;

  constructor (deck: Deck) {
    this.deck = deck;
    this.reveal = deck.getRevealElement();
  }

  render (): void {
    const adminDiv: HTMLDivElement = document.createElement('div');
    adminDiv.classList.add('quiz-admin-controls');
    adminDiv.textContent = 'Admin controls';

    const lockButton = document.createElement('button');
    lockButton.textContent = 'Lock';
    lockButton.onclick = () => {
      this.deck.dispatchEvent({type: 'quiz-lock', data:{}});
    };

    const unlockButton = document.createElement('button');
    unlockButton.textContent = 'Unlock';
    unlockButton.onclick = () => {
      this.deck.dispatchEvent({type: 'quiz-unlock', data:{}});
    };

    adminDiv.append(lockButton);
    adminDiv.append(unlockButton);

    // insert admin div just before the slides
    this.reveal.before(adminDiv);

    // add class to parent to allow styling
    this.reveal.parentElement.classList.add('quiz-admin');
  }

}
