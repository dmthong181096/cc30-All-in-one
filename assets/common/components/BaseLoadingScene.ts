import * as cc from 'cc';
import { BaseSubscriber } from '../helper/BaseSubscriber';
const { ccclass, property } = cc._decorator;

@ccclass('BaseLoadingScene')
export class BaseLoadingScene extends BaseSubscriber {    
    @property({ displayName: "Game Scene Name", type: cc.CCString })
    gameSceneName: string = "";
    
    start(): void {
        this.preloadGameScene();
    }
    
    protected preloadGameScene(): void {
        if(!this.gameSceneName){
            return;
        }
        cc.director.preloadScene(this.gameSceneName, 
            (completedCount: number, totalCount: number) => {
                const progress = completedCount / totalCount;
                this.updateProgress(progress);
            }, 
            (error: Error | null) => {
                if (error) {
                    } else {
                    this.updateProgress(1);
                    this.scheduleOnce(() => {
                        cc.director.loadScene(this.gameSceneName);
                    }, 0.3);
                }
            }
        );
    }
    
    protected updateProgress(progress: number): void {

    }
}


