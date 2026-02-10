import Events from "./Events";

export default class Time 
{
    constructor()
    {
        this.events = new Events();

        this.startTime = Date.now();
        this.currentTime = this.startTime;
        this.timeElapsed = this.currentTime - this.startTime;
        this.delta = 60;

        this.maxDelta = 60;

        this.tick = this.tick.bind(this);
        this.tick()
    }

    tick()
    {
        requestAnimationFrame(this.tick);

        const previousTime = this.currentTime;

        this.currentTime = Date.now();
        this.timeElapsed = this.currentTime - this.startTime;
        
        this.delta = Math.min(this.currentTime - previousTime, this.maxDelta);

        this.events.trigger('tick')
    }
}