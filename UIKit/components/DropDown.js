import { EventEmitter } from '../../JSEngineKit/main.js'

export class DropDown {
    constructor(values, placeholder = null) {
        this.values = values;
        this.placeholder = placeholder;
        this.onchange = new EventEmitter();
        this.dom = null;
    }
    createDOM() {
        const t = document.createElement('select');
        t.className = 'UIKitDropDown';
        t.onchange = () => {this.onchange.call();}
        if(this.placeholder) {
            const p = document.createElement('option')
            p.value = '';
            p.selected = true;
            p.disabled = true;
            p.hidden = true;
            t.appendChild(p);
        }
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