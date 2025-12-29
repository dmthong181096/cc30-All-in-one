class EventEmitter {
    private events: { [key: string]: Function[] } = {};

    on(eventName: string, callback: Function): void {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    emit(eventName: string, data?: any): void {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => callback(data));
        }
    }

    off(eventName: string, callback: Function): void {
        if (this.events[eventName]) {
            const index = this.events[eventName].indexOf(callback);
            if (index > -1) {
                this.events[eventName].splice(index, 1);
            }
        }
    }

    removeAllListeners(): void {
        this.events = {};
    }
}
export  default EventEmitter;


