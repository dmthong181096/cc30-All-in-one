import { _decorator, Component } from 'cc';
import { BaseSubscriber } from './BaseSubscriber';

const { ccclass } = _decorator;

@ccclass('BaseVoiceManager')
export class BaseVoiceManager extends BaseSubscriber {
    
    private recognition: any = null;
    private isListening: boolean = false;
    
    start() {
        super.start && super.start();
        this.initVoiceRecognition();
    }
    
    private initVoiceRecognition(): void {
        if (cc.sys.isBrowser) {
            this.initWebSpeechAPI();
        } else if (cc.sys.isNative) {
            this.initNativeVoice();
        }
    }
    
    private initWebSpeechAPI(): void {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('Speech Recognition not supported');
            this.fireEvent('voice-not-supported');
            return;
        }
        
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'vi-VN';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        
        this.recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            const confidence = event.results[0][0].confidence;
            
            this.fireEvent('voice-result', {
                text: transcript,
                confidence: confidence
            });
        };
        
        this.recognition.onerror = (event: any) => {
            this.fireEvent('voice-error', { error: event.error });
            this.isListening = false;
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.fireEvent('voice-ended');
        };
    }
    
    private initNativeVoice(): void {
        if (cc.sys.os === cc.sys.OS.ANDROID) {
            // Android SpeechRecognizer via JSB
            this.initAndroidVoice();
        } else if (cc.sys.os === cc.sys.OS.IOS) {
            // iOS Speech Framework via JSB
            this.initIOSVoice();
        }
    }
    
    private initAndroidVoice(): void {
        // Call native Android method
        if (typeof jsb !== 'undefined') {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/VoiceHelper", 
                "initSpeechRecognizer", "()V");
        }
    }
    
    private initIOSVoice(): void {
        // Call native iOS method
        if (typeof jsb !== 'undefined') {
            jsb.reflection.callStaticMethod("VoiceHelper", 
                "initSpeechRecognizer:", "");
        }
    }
    
    startListening(): void {
        if (this.isListening) return;
        
        if (cc.sys.isBrowser && this.recognition) {
            this.recognition.start();
            this.isListening = true;
            this.fireEvent('voice-started');
        } else if (cc.sys.isNative) {
            this.startNativeListening();
        }
    }
    
    stopListening(): void {
        if (!this.isListening) return;
        
        if (cc.sys.isBrowser && this.recognition) {
            this.recognition.stop();
        } else if (cc.sys.isNative) {
            this.stopNativeListening();
        }
        
        this.isListening = false;
    }
    
    private startNativeListening(): void {
        if (typeof jsb !== 'undefined') {
            if (cc.sys.os === cc.sys.OS.ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/VoiceHelper", 
                    "startListening", "()V");
            } else if (cc.sys.os === cc.sys.OS.IOS) {
                jsb.reflection.callStaticMethod("VoiceHelper", 
                    "startListening:", "");
            }
        }
        this.isListening = true;
        this.fireEvent('voice-started');
    }
    
    private stopNativeListening(): void {
        if (typeof jsb !== 'undefined') {
            if (cc.sys.os === cc.sys.OS.ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/VoiceHelper", 
                    "stopListening", "()V");
            } else if (cc.sys.os === cc.sys.OS.IOS) {
                jsb.reflection.callStaticMethod("VoiceHelper", 
                    "stopListening:", "");
            }
        }
    }
    
    isSupported(): boolean {
        if (cc.sys.isBrowser) {
            return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
        }
        return cc.sys.isNative; // Assume native always supports
    }
}