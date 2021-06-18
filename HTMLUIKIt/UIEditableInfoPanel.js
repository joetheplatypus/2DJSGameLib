import DOM from './DOM.js'
import UIList from './UIList.js'
import { UIMultiInputPanel } from './UIMultiInputPanel.js'

export class UIEditableInfoPanel {
    constructor(position) {
        this.position = position;
        this.persist = true;
        this.text = '';
        this.keys = [];
        this.values = [];
        this.editCB = (values) => {};
        this.createDom();
        UIList.add(this);
    }
    createDom() {   
        const div = document.createElement('div');
        div.className = 'UIKitPanel'
        div.style.top = this.position.y;
        div.style.left = this.position.x;

        const close = document.createElement('div');
        close.className = 'close'
        close.innerHTML = '<i class="material-icons icon-med">close</i>'
        close.onclick = () => { this.hide() }
        div.appendChild(close);

        const textDiv = document.createElement('div');
        textDiv.className = 'UIKitTitle row'
        textDiv.innerText = this.text;
        div.appendChild(textDiv)
        this.textDiv = textDiv;

        this.inputCtrDom = document.createElement('div')

        this.inputDoms = []
        for(let i = 0; i < this.keys.length; i++) {
            const input = document.createElement('p')
            input.className = 'UIKitKeyVal row'
            input.innerHTML = `<span class="UIKitKey">${this.keys[i]}:&nbsp;</span><span class="UIKitVal">${this.values[i]}</span>`
            this.inputDoms[i] = input;
            this.inputCtrDom.appendChild(input)
        }
        div.appendChild(this.inputCtrDom)

        const btnDiv = document.createElement('div');
        btnDiv.className = 'UIKitBtnCtr'

        const btnAdd = document.createElement('button')
        btnAdd.innerText = 'Edit'
        btnAdd.onclick = () => {this.edit()};
        btnDiv.appendChild(btnAdd)
        div.appendChild(btnDiv)

        this.dom = div;
        DOM.add(this.dom);
    }
    show() {
        this.dom.style.display = 'inline-block';
    }
    hide() {
        this.dom.style.display = 'none';
        if(!this.persist) {
            this.remove()
        }
    }
    remove() {
        UIList.remove(this)
        DOM.remove(this.dom)
    }
    update() {
        if(this.dom) {
            // position
            const screenPos = DOM.project(this.position)
            this.dom.style.top = screenPos.y;
            this.dom.style.left = screenPos.x;
            // offset for centering
            this.dom.style.marginLeft = `-${this.dom.offsetWidth/2}px`;
            this.dom.style.marginTop = `-${this.dom.offsetHeight/2}px`;           
        }
    }
    setText(text) {
        this.text = text;
        this.textDiv.innerText = this.text;
    }
    setKeyVals(keys, values) {
        this.keys = keys;
        this.values = values;
        // Clear
        this.inputCtrDom.innerHTML = '';
        this.inputDoms = [];
        // Build
        for(let i = 0; i < this.keys.length; i++) {
            const input = document.createElement('p')
            input.className = 'UIKitKeyVal row'
            input.innerHTML = `<span class="UIKitKey">${this.keys[i]}:&nbsp;</span><span class="UIKitVal">${this.values[i]}</span>`
            this.inputDoms[i] = input;
            this.inputCtrDom.appendChild(input)
        }
    }
    edit() {
        const pstbkp = this.persist
        this.persist = true;
        this.hide();
        this.persist = pstbkp
        UIMultiInputPanel.create(this.position, 'Edit Info', this.keys, this.values, (values) => {
            this.values = this.editCB(values);
            this.setKeyVals(this.keys, this.values);
            this.show();
        }, () => {
            this.show();
        })
    }
    setEditCB(cb) {
        this.editCB = cb;
    }
    static create(position, text, keys, values, editCB) {
        const ip = new UIEditableInfoPanel(position);
        ip.persist = false;
        ip.setText(text);
        ip.setKeyVals(keys, values);
        ip.setEditCB(editCB)
        ip.show()
    }
}