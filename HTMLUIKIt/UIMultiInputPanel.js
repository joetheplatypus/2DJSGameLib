import DOM from './DOM.js'
import UIList from './UIList.js'

export class UIMultiInputPanel {
    constructor(position) {
        this.position = position;
        this.persist = true;
        this.text = '';
        this.inputs = []
        this.cb = (input) => {}
        this.cancelCB = () => {}
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
        for(let i = 0; i < this.inputs.length; i++) {
            const input = document.createElement('input')
            input.className = 'UIKitInput row'
            input.placeholder = this.inputs[i]
            this.inputDoms[i] = input;
            this.inputCtrDom.appendChild(input)
        }
        div.appendChild(this.inputCtrDom)

        const btnDiv = document.createElement('div');
        btnDiv.className = 'UIKitBtnCtr row'

        const btnNo = document.createElement('button')
        btnNo.innerText = 'Cancel'
        btnNo.onclick = () => {this.cancelCB(); this.hide()};
        btnDiv.appendChild(btnNo)

        const btnYes = document.createElement('button')
        btnYes.innerText = 'Done'
        btnYes.onclick = () => {this.cb(this.inputDoms.map(dom => dom.value)); this.hide()};
        btnDiv.appendChild(btnYes)

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
    setInputs(inputs) {
        this.inputs = inputs;
        // Clear
        this.inputCtrDom.innerHTML = '';
        this.inputDoms = [];
        // Build
        for(let i = 0; i < this.inputs.length; i++) {
            const input = document.createElement('input')
            input.className = 'UIKitInput row'
            input.placeholder = this.inputs[i]
            this.inputDoms[i] = input;
            this.inputCtrDom.appendChild(input)
        }
    }
    setValues(values) {
        for(let i = 0; i < values.length; i++) {
            this.inputDoms[i].value = values[i]
        }
    }
    setCB(cb) {
        this.cb = cb;
    }
    setCancelCB(cb) {
        if(cb) {
            this.cancelCB = cb;
        } else {
            this.cancelCB = () => {};
        }   
    }
    static create(position, text, inputs, values, cb, cancelCB) {
        const ip = new UIMultiInputPanel(position);
        ip.persist = false;
        ip.setText(text);
        ip.setInputs(inputs);
        ip.setValues(values);
        ip.setCancelCB(cancelCB)
        ip.setCB((values) => {
            cb(values)
        })
        ip.show()
        
    }
}