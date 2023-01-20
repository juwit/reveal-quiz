interface Event {
    type: string;
    data: object;
}

export interface Deck {
    dispatchEvent(event: Event);

    getRevealElement(): HTMLElement;

    on(event: string, callback: () => void);

    off(event: string, callback: () => void);
}