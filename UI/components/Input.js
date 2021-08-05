import { EventEmitter } from '../../Engine/main.js'

export class Input {
    constructor(placeholder, value = '') {
        this.text = placeholder;
        this.value = value;
        this.onchange = new EventEmitter();
        this.dom = null;
    }
    createDOM() {
        const t = document.createElement('input');
        t.placeholder = this.text;
        t.value = this.value;
        t.className = 'UIKitInput';
        t.oninput = () => {this.onchange.call();}
        this.dom = t;
        return t;
    }
    getValue() {
        return this.dom.value;
    }
}