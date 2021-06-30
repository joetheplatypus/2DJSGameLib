import { addDOM, getCamera } from "./util.js";
export class UIBase {
    constructor() {
        this.position = { x:0, y:0 };
        this.hidden = false;
        this.worldCoords = true; // Set true if position is in world coords rather than screen position
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
                if(this.worldCoords) {
                    const screenPos = getCamera().to(this.position)
                    this.dom.style.top = screenPos.y;
                    this.dom.style.left = screenPos.x;
                } else {
                    this.dom.style.top = this.position.y;
                    this.dom.style.left = this.position.x;
                }
            }
        }
    }
    static updateAll() {
        UIBase.list.map(u => u.update())
    }
}
UIBase.list = [];