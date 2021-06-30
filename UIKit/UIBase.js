import { addDOM } from "./util.js";
export class UIBase {
    constructor() {
        this.position = { x:0, y:0 };
        this.hidden = false;
        this.dom = this.createDOM();
        addDOM(this.dom);
        UIBase.list.push(this);
    }
    createDOM() {
        // To be overwritten with DOM components
    }
    update() {
        if(this.dom) {
            if(this.hidden) {
                this.dom.style.display = 'none'
            } else {
                this.dom.style.display = 'inline-block'
                this.dom.style.top = this.position.y;
                this.dom.style.left = this.position.x;
            }
        }
    }
    static updateAll() {
        UIBase.list.map(u => u.update())
    }
}
UIBase.list = [];