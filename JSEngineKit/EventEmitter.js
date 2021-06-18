export default class EventEmitter {
    constructor() {
        this.listeners = [];
    }
    add(f) {
        this.listeners.push(f)
    }
    call() {
        this.listeners.map(f=>f())
    }
}