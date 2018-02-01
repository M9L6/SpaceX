import GameManager from './GameManager';
import { State } from './InitData';
import Trigger from './Trigger';
import PathManager from './PathManager';
const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraFollow extends cc.Component {

    private gamemamanger:GameManager;
    private pathmanager:PathManager;
    public movespeed:number = 5;
    private initpos:cc.Vec2;

    start () {
        this.initpos = this.node.position.clone();
        let manager:cc.Node = cc.find("manager");
        this.gamemamanger = manager.getComponent<GameManager>(GameManager);
        this.pathmanager = manager.getComponent<PathManager>(PathManager);
        let trigger = this.node.getComponent<Trigger>(Trigger);
        trigger.collisionEntercallback = this.spanNode.bind(this);   
    }

    update(dt){
        if(this.gamemamanger.curstate == State.control ){
            this.node.y += this.movespeed*dt;
        }
    }

    spanNode(other:cc.Collider,self:cc.Collider){
        //console.log(other.node.name);
        if(other.node.name === "lprefabbox" || other.node.name === "lprefabcircle"){
            this.pathmanager.spanNode(true);
        }
        if(other.node.name === "rprefabbox" || other.node.name === "rprefabcircle"){
            this.pathmanager.spanNode(false);
        }
    }
    reset(){
        this.node.setPosition(this.initpos);
    }
}
