import { _decorator, Component } from 'cc';
import { BaseDataStore } from './BaseDataStore';
import { BaseConfig } from './BaseConfig';
import { BaseAssetsManager } from './BaseAssetsManager';
import  EventEmitter  from './BaseEventEmiter';


const { ccclass } = _decorator;



@ccclass('BaseSubscriber')
export class BaseSubscriber extends Component {
    
    private static eventEmitter: EventEmitter = new EventEmitter();

    onLoad(): void {
        
    }
    public start(): void {
        
    }
    
    getDataStore() {
        return new BaseDataStore as any;
    }
    
    getConfig() {
        return new BaseConfig as any;
    }
    
    getAssetsManager(): BaseAssetsManager {
        return new BaseAssetsManager
    }
    
    fireEvent(eventName: string, data?: any): void {
        BaseSubscriber.eventEmitter.emit(eventName, data);
    }
    
    registerEvent(eventName: string, callback: (data?: any) => void): void {
        BaseSubscriber.eventEmitter.on(eventName, callback);
    }
    
    unregisterEvent(eventName: string, callback: (data?: any) => void): void {
        BaseSubscriber.eventEmitter.off(eventName, callback);
    }
    
    onDestroy(): void {
        BaseSubscriber.eventEmitter.removeAllListeners();
    }
}


