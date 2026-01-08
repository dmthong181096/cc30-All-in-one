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
        return data[key] || 0;
    }
    
    private getAllData(): any {
        const dataString = cc.sys.localStorage.getItem(this.gameID) || '{}';
        try {
            return JSON.parse(dataString);
        } catch (e) {
            cc.warn(`Failed to parse localStorage data for ${this.gameID}:`, e);
            return {};
        }
    }

    defineKey(){
      
    }
    
}


