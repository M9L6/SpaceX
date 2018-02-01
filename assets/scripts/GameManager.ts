import { State, InitData, Sound } from './InitData';
import CameraFollow from './CameraFollow';
import PlayerControl from './PlayerControl';
import PathManager from './PathManager';

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.AudioSource)
    public bgmaudio:cc.AudioSource = null;
    @property(cc.AudioSource)
    public eataudio:cc.AudioSource = null;
    @property(cc.AudioSource)
    public lose1audio:cc.AudioSource = null;
    @property(cc.AudioSource)
    public lose2audio:cc.AudioSource = null;
    @property(cc.AudioSource)
    public startaudio:cc.AudioSource = null;
    
    public curstate:State = State.waiting;
    public score:number = 0;
    public playtimer:number = 0;

    public gameparam:InitData = null;

    private tips:cc.Node = null;
    private scoreui:cc.Label = null;
    private startbtn:cc.Node = null;
    private resetbtn:cc.Node = null;
    private logoui:cc.Node = null;

    private camerafollow:CameraFollow = null;
    private playercontrol:PlayerControl = null;
    private pathmanager:PathManager = null;



    onLoad(){
        this.curstate = State.waitstart;
    }
    start () {
        this.gameparam = new InitData();
        this.gameparam.calcData();
        this.tips = cc.find("ui/tips");
        this.tips.active = false;
        this.scoreui = cc.find("ui/score").getComponent<cc.Label>(cc.Label);
        this.startbtn = cc.find("ui/start");
        this.resetbtn = cc.find("ui/reset");
        this.logoui = cc.find("ui/logo");
        let bound:cc.Node = cc.find("camera/focus/bound");
        let lbound:cc.Node = bound.getChildByName("left"),
            rbound:cc.Node = bound.getChildByName("right"),
            mbound:cc.Node = bound.getChildByName("middle");
        let lx:number = -this.gameparam.bigboundscale*0.5-this.gameparam.roadwidth-this.gameparam.smallboundscale*0.5;
        lbound.width = this.gameparam.smallboundscale;
        lbound.height = this.gameparam.wheight;
        lbound.setPosition(lx,0);
        rbound.width = this.gameparam.smallboundscale;
        rbound.height = this.gameparam.wheight;
        rbound.setPosition(-lx,0);
        mbound.width = this.gameparam.bigboundscale;
        mbound.height = this.gameparam.wheight;
        mbound.setPosition(0,0);

        this.pathmanager = this.node.getComponent<PathManager>(PathManager);
        let player = cc.find("world/player");
        this.playercontrol = player.getComponent<PlayerControl>(PlayerControl); 
        let camera = cc.find("camera");
        this.camerafollow = camera.getComponent<CameraFollow>(CameraFollow);
    }
    update(dt){
        if(this.curstate === State.control){
            this.playtimer += dt;
        }
    }
    gameStart(){
        this.scoreui.node.active = true;
        this.resetbtn.active = false;
        this.startbtn.active = false;
        this.logoui.active = false;
        this.playSound("start");
        this.curstate = State.waitstartgame;
        this.tips.active = true;
    }

    gameStartGame(){
        this.curstate = State.control;
        this.tips.active = false;
    }

    gameEnd(){
        this.playSound(Sound.lose1);
        this.curstate = State.gameover;
        this.resetbtn.active = true;
        //console.log(`Score: {this.score}   Play Time: {this.playtimer}`);
    }

    addScore(){
        this.playSound(Sound.eat);
        this.score++;
        this.scoreui.string = this.score.toString();
    }

    playSound(name){
        switch(name){
            case Sound.bgm:
                this.bgmaudio.play();
                break;
            case Sound.eat:
                this.eataudio.play();
                break;    
            case Sound.lose1:
                this.lose1audio.play();
                break;
            case Sound.lose2:
                this.lose2audio.play();
                break;
            case Sound.start:
                this.startaudio.play();
                break;
            default:
                break;
        }
    }

    reset(){
        this.gameStart();
        this.score = 0;
        this.scoreui.string = "0";
        this.playtimer = 0;
        this.pathmanager.reset();
        this.playercontrol.reset();
        this.camerafollow.reset();
    }   

}
