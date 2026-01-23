import * as cc from 'cc';
import { BaseSubscriber } from './helper/BaseSubscriber';
const { ccclass, property } = cc._decorator;

@ccclass('BaseGameDirector')
export class BaseGameDirector extends BaseSubscriber {
    @property({displayName: "Btn Back Lobby", type: cc.Node})
    btnBackLobby: cc.Node = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
    onLoad(): void {
        this.registerEvents();
    }

    registerEvents(): void {
        if(this.btnBackLobby){
            this.btnBackLobby.on(cc.Node.EventType.TOUCH_END, this.onBackLobby, this);
        }

    }
    onBackLobby(){
        cc.director.loadScene("Lobby");
    }
}


