import DOM from './DOM.js'
import UIList from './UIList.js'

export class UIButtonPanel {
    constructor(position) {
        this.position = position;
        this.text = '';
        this.cbs = []
        this.icons = []
        this.persist = true;
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
        btnDiv.className = 'UIKitBtnPanel'

        const row = document.createElement('div');
        row.className = 'row'

        const leftCol = document.createElement('div')
        leftCol.className = 'column'
        this.leftCol = leftCol;

        const rightCol = document.createElement('div')
        rightCol.className = 'column'
        this.rightCol = rightCol;

        const under = document.createElement('div')
        under.className = 'under row'
        this.under = under;

        row.appendChild(leftCol);
        row.appendChild(rightCol);
        btnDiv.appendChild(row)
        btnDiv.appendChild(under);
        div.appendChild(btnDiv);

        this.dom = div;
        this.hide();
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
            // text
            this.textDiv.innerText = this.text;
        }
    }
    setText(text) {
        this.text = text;
    }
    addBtn(icon, cb) {
        // clear
        this.leftCol.innerHTML = ''
        this.rightCol.innerHTML = ''
        this.under.innerHTML = ''

        // do all but last
        for(let i = 0; i < this.icons.length; i++) {
            const btn = document.createElement('button')
            btn.innerHTML = '<i class="material-icons">' + this.icons[i] + '</i>'
            btn.onclick = () => {this.cbs[i](); this.hide()};
            if(i % 2 == 0) {
                this.leftCol.appendChild(btn)
            } else {
                this.rightCol.appendChild(btn)
            }
        }

        // do last
        this.icons.push(icon);
        this.cbs.push(cb);

        let i = this.icons.length - 1;
        const btn = document.createElement('button')
        btn.innerHTML = '<i class="material-icons">' + this.icons[i] + '</i>'
        btn.onclick = () => {this.cbs[i](); this.hide()};
        if(i % 2 == 0) {
            this.under.appendChild(btn)
        } else {
            this.rightCol.appendChild(btn)
        }
        
    }
    static create(position, title, btncbs) {
        const bp = new UIButtonPanel(position);
        bp.persist = false;
        bp.setText(title);
        btncbs.map(([icon,cb]) => {
            bp.addBtn(icon,cb)
        })
        bp.show();
    }
}