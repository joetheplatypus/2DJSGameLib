import { EventEmitter } from '../../JSEngineKit/main.js'

export class DropDown {
    constructor(values) {
        this.values = values;
        this.onchange = new EventEmitter();
        this.dom = null;
    }
    createDOM() {
        const t = document.createElement('select');
        t.className = 'UIKitDropDown';
        t.onchange = () => {this.onchange.call();}
        this.values.map(v => {
            const a = document.createElement('option')
            a.innerText = v;
            t.appendChild(a);
        })
        this.dom = t;
        return t;
    }
    getValue() {
        return this.dom.value;
    }
}