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
        close.onclick = () => { console.log('a'); this.hidden = true }

        div.appendChild(close);
        return div;
    }
    update() {
        if(this.dom) {
            this.dom.style.top = this.position.y;
            this.dom.style.left = this.position.x;
            if(this.hidden) {
                this.dom.style.display = 'none'
            } else {
                this.dom.style.display = 'inline-block'
            }
        }
    }
    static updateAll() {
        UIBase.list.map(u => u.update())
    }
}
UIBase.list = [];