import DOM from './DOM.js'
import UIList from './UIList.js'

export class UIConfirmPanel {
    constructor(position) {
        this.position = position;
        this.persist = true;
        this.text = '';
        this.yesCB = () => {}
        this.noCB = () => {}
        this.createDom();
        UIList.add(this);
    }
    createDom() {   
        const div = document.createElement('div');
        div.className = 'UIKitPanel'
        const screenPos = DOM.project(this.position)
        div.style.top = screenPos.y;
        div.style.left = screenPos.x;

        const close = document.createElement('div');
        close.className = 'close'
        close.innerHTML = '<i class="material-icons icon-med">close</i>'
        close.onclick = () => { this.hide() }
        div.appendChild(close);

        const textDiv = document.createElement('div');
        textDiv.className = 'UIKitTitle'
        textDiv.innerText = this.text;
        div.appendChild(textDiv)
        this.textDiv = textDiv;

        const btnDiv = document.createElement('div');
        btnDiv.className = 'UIKitBtnCtr'

        const btnNo = document.createElement('button')
        btnNo.innerText = 'No'
        btnNo.onclick = () => {this.noCB(); this.hide()};
        btnDiv.appendChild(btnNo)

        const btnYes = document.createElement('button')
        btnYes.innerText = 'Yes'
        btnYes.onclick = () => {this.yesCB(); this.hide()};
        btnDiv.appendChild(btnYes)

        div.appendChild(btnDiv)

        this.dom = div;
        this.hide()
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
    setYesCB(cb) {
        this.yesCB = cb;
    }
    setNoCB(cb) {
        this.noCB = cb;
    }
    static create(position, text, cb) {
        const cp = new UIConfirmPanel(position);
        cp.persist = false;
        cp.setText(text);
        cp.setYesCB(() => {
            cb()
        })
        cp.show()
        
    }
}