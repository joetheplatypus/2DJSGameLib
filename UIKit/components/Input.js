import { EventEmitter } from '../../JSEngineKit/main.js'

export class Input {
    constructor(placeholder) {
        this.text = placeholder;
        this.onchange = new EventEmitter();
        this.dom = null;
    }
    createDOM() {
        const t = document.createElement('input');
        t.placeholder = this.text;
        t.className = 'UIKitInput';
        t.onchange = () => {this.onchange.call(); console.log('a')}
        this.dom = t;
        return t;
    }
    getValue() {
        return this.dom.value;
    }
}