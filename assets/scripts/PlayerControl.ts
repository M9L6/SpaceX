import { InitData, State, Sound } from './InitData';
import GameManager from './GameManager';
import CameraFollow from './CameraFollow';
import PathManager from './PathManager';
import Trigger from './Trigger';

const {ccclass,property} = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component{ 

    private gameparam:InitData;
    private gamemamanger:GameManager;
    private camerafollow:CameraFollow;
    private pathmanager:PathManager;

    private playerl:cc.Node ;    
    private playerr:cc.Node;

    private xspeed:number = 10;
    private angle:number = 30;
    private movespeed:number = 30;
    private initmovespeed:number = 400;

    private rotspeed:number = 10;
    private langle:number = 0;
    private rangle:number = 0;
    private ltargetangle:number = 0;
    private rtargetangle:number = 0;
    private lplayxdir = -1;
    private rplayxdir = 1;

    private lx:number=0;
    private ly:number=0;
    private rx:number=0;
    private ry:number=0;
    private ltargetx:number=0;
    private rtargetx:number=0;

    private halfscreenwidth:number;

    start(){
        let manager:cc.Node = cc.find("manager");
        this.gamemamanger = manager.getComponent<GameManager>(GameManager);
        this.gameparam = this.gamemamanger.gameparam;
        this.pathmanager = manager.getComponent<PathManager>(PathManager);
        
        let camera:cc.Node = cc.find("camera");
        this.camerafollow = camera.getComponent<CameraFollow>(CameraFollow);
        this.movespeed = this.initmovespeed;
        this.camerafollow.movespeed = this.movespeed;

        this.playerl  = this.node.getChildByName("playerl");
        this.playerr = this.node.getChildByName("playerr");

        this.ltargetx = this.lx = this.gameparam.playerpos[0];
        this.ly = -this.gameparam.wheight/2+120;
        this.rtargetx = this.rx = this.gameparam.playerpos[3];
        this.ry = this.ly;
        this.playerl.setPosition(this.lx,this.ly);
        this.playerr.setPosition(this.rx,this.ry);
        this.halfscreenwidth = window.innerWidth*0.5;
        let firstenter:boolean = true;
        cc.game.canvas.addEventListener("touchstart",(e:TouchEvent)=>{
            e.preventDefault();
            if( cc.sys.platform !== cc.sys.WECHAT_GAME  && cc.sys.os === cc.sys.OS_IOS && firstenter){
                firstenter = false;
                this.gamemamanger.playSound(Sound.bgm);
            } 
            let touches = e.changedTouches;
            this.control(touches);
        });

        let ltrigger:Trigger = this.playerl.getComponent<Trigger>(Trigger),
            rtrigger:Trigger = this.playerr.getComponent<Trigger>(Trigger);
        ltrigger.collisionEntercallback = this.onCollisionEnterL.bind(this);
        rtrigger.collisionEntercallback = this.onCollisionEnterR.bind(this);

    }


    update(dt){
        if(this.gamemamanger.curstate !== State.control){
            return;
        }

        this.move(dt);
    }

    control(touches:TouchList){
        if(this.gamemamanger.curstate === State.waitstartgame){
            this.gamemamanger.gameStartGame();
            return;
        }
        if(this.gamemamanger.curstate !== State.control){
            return;
        }
        let l = false,r = false;
        for(let i = 0;i<touches.length;i++){
            if(touches[i].clientX < this.halfscreenwidth){
                l = true;
            }else{
                r = true;
            }
        }

        if(l){
            this.lplayxdir *= -1;
            this.ltargetx = this.lplayxdir === 1 ? this.gameparam.playerpos[1]:this.gameparam.playerpos[0];
            this.ltargetangle = this.angle*this.lplayxdir;
        }
        if(r){
            this.rplayxdir *= -1;
            this.rtargetx = this.rplayxdir === 1 ? this.gameparam.playerpos[3]:this.gameparam.playerpos[2];
            this.rtargetangle = this.angle*this.rplayxdir;
        }
        //console.log(l+","+r);
    }

    move(dt){
        this.lx = this.lerp(this.lx,this.ltargetx,this.xspeed*dt);
        this.rx = this.lerp(this.rx,this.rtargetx,this.xspeed*dt);
        if(Math.abs(this.lx-this.ltargetx) < 30){
            this.ltargetangle = 0;
        }
        if(Math.abs(this.rx-this.rtargetx) < 30){
            this.rtargetangle = 0;
        }
        this.ly += this.movespeed*dt;
        this.ry += this.movespeed*dt;
        this.langle = this.lerp(this.langle,this.ltargetangle,this.rotspeed*dt);
        this.rangle = this.lerp(this.rangle,this.rtargetangle,this.rotspeed*dt);
        this.playerl.rotation = this.langle;
        this.playerr.rotation = this.rangle;
        this.playerl.setPosition(this.lx,this.ly);
        this.playerr.setPosition(this.rx,this.ry);
    }
    lerp(a:number,b:number,c:number):number{
       
        return (1-c)*a+c*b;
    }
    reset(){
        this.movespeed = this.initmovespeed;
        this.camerafollow.movespeed = this.movespeed;
        this.langle = 0;
        this.rangle = 0;
        this.ltargetangle = 0;
        this.rtargetangle = 0;
        this.ltargetx = this.lx = this.gameparam.playerpos[0];
        this.ly = -this.gameparam.wheight/2+120;
        this.rtargetx = this.rx = this.gameparam.playerpos[3];
        this.ry = this.ly;

        this.playerl.setPosition(this.lx,this.ly);
        this.playerr.setPosition(this.rx,this.ry);
        this.playerl.rotation = this.langle;
        this.playerr.rotation = this.rangle;
    }

    hitLose(hitnode:cc.Node){
        let body = hitnode.getChildByName("body"),
            pt = hitnode.getChildByName("pt");
        body.active = false;
        let ptc = pt.getComponent<cc.ParticleSystem>(cc.ParticleSystem);
        ptc.resetSystem();
    }

    addScore(lr:boolean){
        let level = Math.floor(this.gamemamanger.score/30);
        this.movespeed = (1+level*0.1)*this.initmovespeed;
        this.camerafollow.movespeed = this.movespeed;
    }

    onCollisionEnterL(other:cc.Collider,self:cc.Collider){
        if(other.node.name === "lprefabcircle"){
            other.node.getChildByName("body").active = false;
            this.gamemamanger.addScore();
            this.addScore(true);
        }else{
            if(other.node.name === "lprefabbox"){
                this.gamemamanger.gameEnd();
                this.hitLose(other.node);
            }
        }
    }

    onCollisionEnterR(other:cc.Collider,self:cc.Collider){
        if(other.node.name === "rprefabcircle"){
            other.node.getChildByName("body").active = false;
            this.gamemamanger.addScore();
            this.addScore(false);
        }else{
            if(other.node.name === "rprefabbox"){
                this.gamemamanger.gameEnd();
                this.hitLose(other.node);
            }
        }
    }

}