import { _decorator, Component, Node } from 'cc';
import { BaseSubscriber } from './helper/BaseSubscriber';
const { ccclass, property } = _decorator;

@ccclass('BaseGameDirector')
export class BaseGameDirector extends BaseSubscriber {
    start() {

    }

    update(deltaTime: number) {
        
    }
    onLoad(): void {
        this.registerEvents();
    }

    registerEvents(): void {

    }
}


