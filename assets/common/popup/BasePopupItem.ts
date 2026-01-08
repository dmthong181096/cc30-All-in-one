import * as cc from 'cc';
import { BaseSubscriber } from '../helper/BaseSubscriber';
const { ccclass, property } = cc._decorator;

@ccclass('BasePopupItem')
export class BasePopupItem extends BaseSubscriber {
    @property({displayName: "Main Container", type: cc.Node})
    mainContainer: cc.Node = null;
    @property({displayName: "Overlay", type: cc.Node})
    overlay: cc.Node = null;



    protected isShowing = false;
    onLoad(): void {
        this.init();
        this.isShowing = false;
        this.hidePopup(false);
    }
    init() {
       
    }


    showPopup(isAnim = true, data = {}) {
        if(this.isShowing) return;
        this.node.active = true;
        this.isShowing = true;
        cc.Tween.stopAllByTarget(this.mainContainer);
        if(isAnim){
            this.mainContainer.scale = cc.v3(0.7, 0.7, 0.7);
            cc.tween(this.mainContainer)
                .to(0.3, {scale: cc.v3(1, 1, 1)},{easing :"backOut"})
                .call(()=>{
                    
                })
                .start();
        }else {
            this.mainContainer.scale = cc.v3(1, 1, 1);
        }
       
    }

    hidePopup(isAnim = true){
        if(!this.isShowing) return;
        this.isShowing = false;
          this.node.active = true;
        cc.Tween.stopAllByTarget(this.mainContainer);
        if(isAnim){
            this.mainContainer.scale = cc.v3(1, 1, 1);
            cc.tween(this.mainContainer)
                .to(0.3, {scale: cc.v3(0.7, 0.7, 0.7) }, { easing: 'backIn' })
                .call(()=>{
                    this.node.active = false;
                })
                .start();
        }else {
            this.mainContainer.scale = cc.v3(0, 0, 0);
            this.node.active = false;
        }
 
    }
}


