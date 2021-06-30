import { addDOM } from "./util.js";

export class UIBase {
    constructor() {
        this.position = { x:0, y:0 };
        this.hidden = true;
        this.dom = this.createDOM();
        addDOM(this.dom);
        UIBase.list.push(this);
    }
    createDOM() {
        const div = document.createElement('div');
        div.className = 'UIKitPanel'
        div.style.minWidth = '300px';
        div.style.minHeight = '500px';
        div.style.marginLeft = '-150px';
        div.style.marginTop = '-250px';
        div.style.top = this.position.y;
        div.style.left = this.position.x;

        const close = document.createElement('div');
        close.className = 'close'
        close.innerHTML = '<i class="material-icons icon-med">close</i>'
        close.onclick = () => { this.hidden = true }

        div.appendChild(close);
        return div;
    }
    update() {
        if(this.dom) {
            
        }
    }
    static updateAll() {
        UIBase.map(u => u.update())
    }
}
UIBase.list = [];