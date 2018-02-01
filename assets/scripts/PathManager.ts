import GameManager from './GameManager';
import PlayerControl from './PlayerControl';
import { InitData } from './InitData';
const {ccclass,property} = cc._decorator;

@ccclass
export default class PathManager extends cc.Component{

    private lbprefabs:Array<cc.Node> = new Array<cc.Node>();
    private rbprefabs:Array<cc.Node> = new Array<cc.Node>();
    private lcprefabs:Array<cc.Node> = new Array<cc.Node>();
    private rcprefabs:Array<cc.Node> = new Array<cc.Node>();


    @property(cc.Prefab)
    public lbprefab:cc.Prefab = null;
    @property(cc.Prefab)
    public lcprefab:cc.Prefab = null;
    @property(cc.Prefab)
    public rbprefab:cc.Prefab = null;
    @property(cc.Prefab)
    public rcprefab:cc.Prefab = null;;

    private lbindex:number = 0;
    private lcindex:number = 0;
    private rbindex:number = 0;
    private rcindex:number = 0;
    
    private prefabcount:number = 4;
    private initcout:number = 3;
    
    private spanly:number = 0;
    private spanry:number = 0;

    private blockdis:number = 30;
    private mindis:number = 8;
    private maxdis:number = 12;

    private prefabparent:cc.Node = null;

    private  gamemanager:GameManager = null;
    private playercontrol:PlayerControl = null;
    private gameparam:InitData = null;

    onLoad(){
        cc.director.getCollisionManager().enabled = true;
    }

    start(){
        let manager:cc.Node = cc.find('manager');
        this.gamemanager = manager.getComponent<GameManager>(GameManager);
        this.gameparam = this.gamemanager.gameparam;
        let player:cc.Node = cc.find("world/player");
        this.playercontrol = player.getComponent<PlayerControl>(PlayerControl);
        this.prefabparent = cc.find("world/path");
        this.createPrefabs();
        this.initPath();
    }

    createPrefabs(){
        for(let i =0;i<this.prefabcount;i++){
            let lb:cc.Node = cc.instantiate(this.lbprefab),
                lc:cc.Node = cc.instantiate(this.lcprefab),
                rb:cc.Node = cc.instantiate(this.rbprefab),
                rc:cc.Node = cc.instantiate(this.rcprefab);
            this.prefabparent.addChild(lb);
            this.lbprefabs.push(lb);
            this.prefabparent.addChild(lc);
            this.lcprefabs.push(lc);
            this.prefabparent.addChild(rb);
            this.rbprefabs.push(rb);
            this.prefabparent.addChild(rc);
            this.rcprefabs.push(rc);
        }
    }

    spanNode(lr:boolean){
        let corb:boolean = Math.random()>0.5,
            lorr:boolean = Math.random()>0.5,
            offset:number = Math.floor(Math.random()*(this.maxdis-this.mindis)+this.mindis)*this.blockdis;
        if(lr){
            let x:number = lorr?this.gameparam.playerpos[0]:this.gameparam.playerpos[1];
            this.spanly += offset;
            let obj:cc.Node;
            if(corb){
                obj = this.lcprefabs[this.lcindex];
                this.lcindex = this.lcindex === this.prefabcount -1 ?0:this.lcindex+1;
            }else{
                obj = this.lbprefabs[this.lbindex];
                this.lbindex = this.lbindex === this.prefabcount -1 ?0:this.lbindex+1;
            }
            obj.getChildByName("body").active = true;
            obj.setPosition(x,this.spanly);
            obj.active = true;
            //console.log("left:  "+x+","+this.spanly);
        }else{
            let x:number = lorr?this.gameparam.playerpos[2]:this.gameparam.playerpos[3];
            this.spanry += offset;
            let obj:cc.Node;
            if(corb){
                obj = this.rcprefabs[this.rcindex];
                this.rcindex = this.rcindex === this.prefabcount -1 ?0:this.rcindex+1;
            }else{
                obj = this.rbprefabs[this.rbindex];
                this.rbindex = this.rbindex === this.prefabcount -1 ?0:this.rbindex+1;
            }
            obj.getChildByName("body").active = true;
            obj.setPosition(x,this.spanry);
            obj.active = true;
           // console.log("right:  "+x+","+this.spanry);
        }
    }

    initPath(){
        for(let i =0;i<this.prefabcount;i++){
            let lb = this.lbprefabs[i],
                lc = this.lcprefabs[i],
                rb = this.rbprefabs[i],
                rc = this.rcprefabs[i];
            lb.active = false;
            lc.active = false;
            rb.active = false;
            rc.active = false;
        }
        for(let i =0;i<this.initcout;i++){
            this.spanNode(true);
            this.spanNode(false);
        }
    }

    reset(){
        this.mindis = 8;
        this.maxdis = 12;
        this.spanly = 0;
        this.spanry = 0;
        this.lbindex = 0;
        this.rbindex = 0;
        this.lcindex = 0;
        this.rcindex = 0;
        this.initPath();
    }
}