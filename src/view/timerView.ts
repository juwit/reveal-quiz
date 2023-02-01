import {Timer} from "../model/timer";

export default class TimerView{
    private timer: Timer;

    constructor(timer: Timer) {
        this.timer = timer;

        this.timer.onUpdate(() => this.render());
    }

    /**
     * renders the timer on the slide
     */
    render(): void{
        console.log(`Timer : ${this.timer.current}/${this.timer.duration}`);
    }
}