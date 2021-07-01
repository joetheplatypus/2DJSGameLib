import { EventEmitter } from '../../JSEngineKit/main.js'

export class DropDown {
    constructor([placeholder, ...values], value) {
        this.values = values;
        this.value = value;
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
            if(v === this.value) {
                a.selected = true;
            }
            t.appendChild(a);
        })
        this.dom = t;
        return t;
    }
    getValue() {
        return this.dom.value;
    }
}