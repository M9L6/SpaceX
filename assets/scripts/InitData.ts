export enum State{
    waiting = 0,
    waitstart = 1,
    waitstartgame = 2,
    control = 3,
    gameover = 4
}
export enum Sound{
    bgm = 0,
    start = 1,
    eat = 2,
    lose1 = 3,
    lose2 = 4
}
export  class InitData{
    
    public wheight:number;
    public wwidth:number;
    public bigboundscale:number;
    public smallboundscale:number;
    public roadwidth:number;
    public boundswidth:number;
    public playerpos:Array<number> = new Array<number>();

    constructor(){

    }

    calcData(){
        let w = window.innerWidth,
            h = window.innerHeight;
        this.wheight = 736;
        this.wwidth = this.wheight*w/h;
        this.bigboundscale = 2/135*this.wwidth;
        this.smallboundscale = 1/135*this.wwidth;
        this.roadwidth = 127/135*this.wwidth*0.25;

        let rlx = this.bigboundscale*0.5+this.roadwidth*0.5,
            rrx = this.bigboundscale*0.5+this.roadwidth*1.5+this.smallboundscale,
            llx = -rrx,
            lrx = -rlx;
        this.playerpos.push(llx,lrx,rlx,rrx);
        console.log(this.wheight,this.wwidth,this.bigboundscale,this.smallboundscale,this.roadwidth);
    }
}
