import Events from "./Events";

export default class Viewport
{
    constructor()
    {
        this.events = new Events();

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        this.resize = this.resize.bind(this);
        this.resize();
    }

    resize()
    {
        addEventListener('resize', ()=>{
            // console.log('resize')
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.events.trigger('resize');
        })
    }
}