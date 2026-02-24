import { _decorator, Component, Button, director } from 'cc';
import { BaseSubscriber } from '../helper/BaseSubscriber';

const { ccclass, property } = _decorator;

@ccclass('LobbyManager')
export class LobbyManager extends BaseSubscriber {
    
    @property(Button)
    btnNeonPath: Button = null!;
    
    @property(Button)
    btnRadarStrike: Button = null!;
    
    @property(Button)
    btnVoiceGame: Button = null!;

    @property(Button)
    btnBlockBlast: Button = null!;

    init() {
        this.setupButtons();
    }

    private setupButtons() {
        if (this.btnNeonPath) {
            this.btnNeonPath.node.on(Button.EventType.CLICK, this.onNeonPathClick, this);
        }
        
        if (this.btnRadarStrike) {
            this.btnRadarStrike.node.on(Button.EventType.CLICK, this.onRadarStrikeClick, this);
        }
        
        if (this.btnVoiceGame) {
            this.btnVoiceGame.node.on(Button.EventType.CLICK, this.onVoiceGameClick, this);
        }
        if (this.btnBlockBlast) {
            this.btnBlockBlast.node.on(Button.EventType.CLICK, this.onBlockBlastClick, this);
        }
    }
    private onBlockBlastClick() {
        director.loadScene('Loading04');
    }

    private onNeonPathClick() {
        director.loadScene('Loading02');
    }

    private onRadarStrikeClick() {

        director.loadScene('Loading03');
    }

    private onVoiceGameClick() {

        director.loadScene('Loading01');
    }

}
