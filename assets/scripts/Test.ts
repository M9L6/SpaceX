const {ccclass, property} = cc._decorator;

@ccclass
export default class Test extends cc.Component {


    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(e:cc.Event.EventTouch)=>{
            let x = e.getLocationX();
            console.log(x);
        })
    }

}
