import * as cc from 'cc';
const { ccclass, property } = cc._decorator;

@ccclass('BaseAnimateCounter')
export class BaseAnimateCounter extends cc.Component {
 private lbScore: cc.Label = null;
    private currentValue: number = 0;
    private targetValue: number = 0;
    private countTween: cc.Tween<any> = null;

    onLoad(): void {
        // Auto find Label component on this node
        this.lbScore = this.node.getComponent(cc.Label);
        if (!this.lbScore) {
            console.error('ScorePopup03: Label component not found on node!');
        }
    }

    /**
     * Update score with counting animation
     * @param newScore New score value to count to
     */
    updateScore(newScore: number, countDuration = 0.5, useEasing = true): void {
        if (!this.lbScore) return;

        // Stop current animation if running
        if (this.countTween) {
            this.countTween.stop();
        }

        this.targetValue = newScore;
        
        // Create counting animation
        const tempObj = { value: this.currentValue };
        
        this.countTween = cc.tween(tempObj)
            .to(countDuration, 
                { value: this.targetValue }, 
                { 
                    easing: useEasing ? 'quadOut' : 'linear',
                    onUpdate: () => {
                        this.currentValue = Math.floor(tempObj.value);
                        this.updateDisplay();
                    }
                }
            )
            .call(() => {
                this.currentValue = this.targetValue;
                this.updateDisplay();
            })
            .start();
    }

    /**
     * Set score immediately without animation
     */
    setScore(score: number): void {
        if (!this.lbScore) return;

        if (this.countTween) {
            this.countTween.stop();
        }
        this.currentValue = score;
        this.targetValue = score;
        this.updateDisplay();
    }

    /**
     * Update label display
     */
    private updateDisplay(): void {
        if (this.lbScore) {
            this.lbScore.string = this.formatScore(this.currentValue);
        }
    }

    /**
     * Format score with thousand separators
     */
    private formatScore(score: number): string {
        return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * Get current displayed value
     */
    getCurrentValue(): number {
        return this.currentValue;
    }

    onDestroy(): void {
        if (this.countTween) {
            this.countTween.stop();
        }
    }
}


