import { _decorator, Component , sys} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseDataStore')
export class BaseDataStore extends Component {


    // protected onLoad(): void {
    //     this.defineKey();
    // }

    protected gameID = "";

    setLocalStoreByKey(key, value){
        sys.localStorage.setItem(this.gameID + key, value);
    }
    getLocalStoreByKey(key){
        if(this.gameID == ""){
            this.defineKey();
        }
        return sys.localStorage.getItem(this.gameID + key) || 0;
    }

    defineKey(){
      
    }
    
}


