import * as cc from 'cc';
import { BaseSubscriber } from '../helper/BaseSubscriber';
const { ccclass, property } = cc._decorator;

@ccclass('BasePopupItem')
export class BasePopupItem extends BaseSubscriber {
    @property({displayName: "Main Container", type: cc.Node})
    mainContainer: cc.Node = null;
    @property({displayName: "Overlay", type: cc.Node})
    overlay: cc.Node = null;
    @property({displayName:"Button Close", type: cc.Node})
    btnClose: cc.Node = null;



    protected isShowing = false;
    onLoad(): void {
        this.init();
        this.isShowing = false;
        this.hidePopup(false);
    }

    init() {
        this.initProps();
    }
    initProps(){
        if(this.btnClose){
            this.btnClose.on(cc.Input.EventType.TOUCH_END, this.onClickClose, this);
        }
    }

    initOverlay (overlay: cc.Node){
        if(!this.overlay){
            this.overlay = overlay;
        }
    }
    onClickClose(){
        this.hidePopup(true, ()=>{
            if(this.overlay) this.overlay.active = false;
        });
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

    hidePopup(isAnim = true ,callback = null){
        if(!this.isShowing && isAnim) return;
        this.isShowing = false;
        this.node.active = true;
        cc.Tween.stopAllByTarget(this.mainContainer);
        if(isAnim){
            this.mainContainer.scale = cc.v3(1, 1, 1);
            cc.tween(this.mainContainer)
                .to(0.3, {scale: cc.v3(0.7, 0.7, 0.7) }, { easing: 'backIn' })
                .call(()=>{
                    this.node.active = false;
                    if(callback) callback();
                })
                .start();
        }else {
            this.mainContainer.scale = cc.v3(0, 0, 0);
            this.node.active = false;
        }
 
    }
}


