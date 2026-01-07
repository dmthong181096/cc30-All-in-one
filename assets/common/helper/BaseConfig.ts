import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseConfig')
export class BaseConfig extends Component {


    protected config = null;


    
    protected onLoad(): void {
        
        this.defineConfig();
    }

    


    defineConfig() {
        return this.config;
    }

}


