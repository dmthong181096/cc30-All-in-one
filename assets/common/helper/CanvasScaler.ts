import { _decorator, Component, Canvas, view, screen, ResolutionPolicy, UITransform } from 'cc';

const { ccclass, property } = _decorator;

export enum ScaleMode {
    AUTO = 0,
    FIT_WIDTH = 1,
    FIT_HEIGHT = 2,
    SHOW_ALL = 3,
    NO_BORDER = 4
}

@ccclass('CanvasScaler')
export class CanvasScaler extends Component {
    
    @property
    designWidth: number = 720;
    
    @property
    designHeight: number = 1280;
    
    @property({
        type: ScaleMode,
        tooltip: 'AUTO: Tự động chọn policy phù hợp\nFIT_WIDTH: Fit theo width\nFIT_HEIGHT: Fit theo height\nSHOW_ALL: Hiện tất cả (letterbox)\nNO_BORDER: Fill màn hình (crop)'
    })
    scaleMode: ScaleMode = ScaleMode.AUTO;

    @property({
        tooltip: 'Tự động điều chỉnh khi resize/rotate màn hình'
    })
    autoAdjust: boolean = true;

    @property({
        tooltip: 'Cho phép rotate design resolution khi màn hình landscape (tắt khi test desktop)'
    })
    allowRotateDesign: boolean = false;

    private canvas: Canvas = null!;

    onLoad() {
        this.canvas = this.getComponent(Canvas)!;
        this.adjustCanvas();
        
        if (this.autoAdjust) {
            screen.on('window-resize', this.onScreenChange, this);
            screen.on('orientation-change', this.onScreenChange, this);
        }
    }

    start() {
        this.scheduleOnce(() => {
            this.adjustCanvas();
        }, 0.1);
    }

    private onScreenChange() {
        this.scheduleOnce(() => {
            this.adjustCanvas();
        }, 0.1);
    }

    adjustCanvas() {
        if (!this.canvas) return;

        const frameSize = screen.windowSize;
        let screenWidth = frameSize.width;
        let screenHeight = frameSize.height;
        
        const screenRatio = screenWidth / screenHeight;
        const designRatio = this.designWidth / this.designHeight;
        
        const isScreenLandscape = screenWidth > screenHeight;
        const isDesignPortrait = this.designWidth < this.designHeight;

        console.log(`[CanvasScaler] Screen: ${screenWidth}x${screenHeight} (ratio: ${screenRatio.toFixed(2)}, ${isScreenLandscape ? 'landscape' : 'portrait'})`);
        console.log(`[CanvasScaler] Design: ${this.designWidth}x${this.designHeight} (ratio: ${designRatio.toFixed(2)}, ${isDesignPortrait ? 'portrait' : 'landscape'})`);

        let finalWidth = this.designWidth;
        let finalHeight = this.designHeight;
        let policy: ResolutionPolicy;

        // Nếu screen landscape nhưng design portrait
        if (isScreenLandscape && isDesignPortrait) {
            if (this.allowRotateDesign) {
                // Rotate design
                finalWidth = this.designHeight;
                finalHeight = this.designWidth;
                console.log(`[CanvasScaler] Rotated design to: ${finalWidth}x${finalHeight}`);
            } else {
                // Không rotate - dùng SHOW_ALL để hiện toàn bộ portrait UI trên landscape screen
                console.log(`[CanvasScaler] Portrait design on landscape screen - using SHOW_ALL`);
                view.setDesignResolutionSize(
                    this.designWidth,
                    this.designHeight,
                    ResolutionPolicy.SHOW_ALL
                );
                
                const uiTransform = this.getComponent(UITransform);
                if (uiTransform) {
                    uiTransform.width = this.designWidth;
                    uiTransform.height = this.designHeight;
                }
                console.log(`[CanvasScaler] Applied: ${this.designWidth}x${this.designHeight}, Policy: SHOW_ALL`);
                return;
            }
        }

        // Chọn policy
        if (this.scaleMode === ScaleMode.AUTO) {
            // Auto: chọn policy dựa trên tỷ lệ màn hình
            const finalDesignRatio = finalWidth / finalHeight;
            
            if (Math.abs(screenRatio - finalDesignRatio) < 0.1) {
                // Tỷ lệ gần giống nhau
                policy = ResolutionPolicy.SHOW_ALL;
            } else if (screenRatio < finalDesignRatio) {
                // Màn hình hẹp hơn design (1.46 < 1.78) -> fit height để không crop
                policy = ResolutionPolicy.FIXED_HEIGHT;
            } else {
                // Màn hình rộng hơn design -> fit width
                policy = ResolutionPolicy.FIXED_WIDTH;
            }
            console.log(`[CanvasScaler] AUTO selected: ${this.getPolicyName(policy)} (screen ratio ${screenRatio.toFixed(2)} vs design ${finalDesignRatio.toFixed(2)})`);
        } else {
            policy = this.getPolicyFromMode(this.scaleMode);
        }

        view.setDesignResolutionSize(finalWidth, finalHeight, policy);

        // Update canvas size
        const uiTransform = this.getComponent(UITransform);
        if (uiTransform) {
            uiTransform.width = finalWidth;
            uiTransform.height = finalHeight;
        }

        console.log(`[CanvasScaler] Applied: ${finalWidth}x${finalHeight}, Policy: ${this.getPolicyName(policy)}`);
    }

    private getPolicyFromMode(mode: ScaleMode): ResolutionPolicy {
        switch (mode) {
            case ScaleMode.FIT_WIDTH:
                return ResolutionPolicy.FIXED_WIDTH;
            case ScaleMode.FIT_HEIGHT:
                return ResolutionPolicy.FIXED_HEIGHT;
            case ScaleMode.SHOW_ALL:
                return ResolutionPolicy.SHOW_ALL;
            case ScaleMode.NO_BORDER:
                return ResolutionPolicy.NO_BORDER;
            default:
                return ResolutionPolicy.SHOW_ALL;
        }
    }

    private getPolicyName(policy: ResolutionPolicy): string {
        switch (policy) {
            case ResolutionPolicy.FIXED_WIDTH: return 'FIXED_WIDTH';
            case ResolutionPolicy.FIXED_HEIGHT: return 'FIXED_HEIGHT';
            case ResolutionPolicy.SHOW_ALL: return 'SHOW_ALL';
            case ResolutionPolicy.NO_BORDER: return 'NO_BORDER';
            case ResolutionPolicy.EXACT_FIT: return 'EXACT_FIT';
            default: return 'UNKNOWN';
        }
    }

    onDestroy() {
        if (this.autoAdjust) {
            screen.off('window-resize', this.onScreenChange, this);
            screen.off('orientation-change', this.onScreenChange, this);
        }
    }
}
