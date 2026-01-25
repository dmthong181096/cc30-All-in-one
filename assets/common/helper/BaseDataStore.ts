import * as cc from 'cc';
const { ccclass } = cc._decorator;

@ccclass('BaseDataStore')
export class BaseDataStore extends cc.Component {

    protected gameID = "";

    setLocalStoreByKey(key: string, value: any): void {
        if(this.gameID == ""){
            this.defineKey();
        }
        const existingData = this.getAllData();
        existingData[key] = value;
        cc.sys.localStorage.setItem(this.gameID, JSON.stringify(existingData));
    }

    getLocalStoreByKey(key: string): any {
        if(this.gameID == ""){
            this.defineKey();
        }
        
        const data = this.getAllData();
        return data[key] == null || data[key] == undefined ? 0 : data[key];
    }
    
    getAllData(): any {
        const dataString = cc.sys.localStorage.getItem(this.gameID) || '{}';
        try {
            return JSON.parse(dataString);
        } catch (e) {
            return {};
        }
    }

    defineKey(){
      
    }

    toggleSound(isOn: boolean): void {
        this.setLocalStoreByKey("toggleSound", isOn);
    }
    getToggleSound(): boolean {
        let result = this.getLocalStoreByKey("toggleSound");
        if(this.getLocalStoreByKey("toggleSound") == null || this.getLocalStoreByKey("toggleSound") == undefined){
            result = true;
        }
        return result;
    }
    getToggleMusic(): boolean {
        let result = this.getLocalStoreByKey("toggleMusic");
        if(this.getLocalStoreByKey("toggleMusic") == null || this.getLocalStoreByKey("toggleMusic") == undefined){
            result = true;
        }
        return result;
    }
    
    toggleMusic(isOn: boolean): void {
        this.setLocalStoreByKey("toggleMusic", isOn);
    }

    getHighScore(): number {
        return this.getLocalStoreByKey("highScore") || 0;
    }

    setHighScore(score: number): void {
        this.setLocalStoreByKey("highScore", score);
    }
    
    
}


