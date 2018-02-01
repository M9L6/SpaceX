const {ccclass, property} = cc._decorator;

@ccclass
export default class Trigger extends cc.Component {

    public collisionEntercallback:any = null;

    onCollisionEnter(other:cc.Collider,self:cc.Collider){
        this.collisionEntercallback && this.collisionEntercallback(other,self);
    }


}
