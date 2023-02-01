export interface Timer {
  start(): void;
  stop(): void;
}

export default class TimerImpl implements Timer{
  private readonly duration: number

  private current: number;
  private interval: any;

  constructor (duration: number) {
    this.duration = duration;
  }

  start (): void {
    console.log('timer start');
    this.current = this.duration;
    this.interval = setInterval(()=>{
      this.current--;
      if(this.current < 0 ){
        this.stop();
      }
    }, 1000);
  }

  stop (): void {
    clearInterval(this.interval);
    console.log('timer stop');
  }
}
