import { addDOM, getCamera, removeDOM } from "./util.js";
import { EventEmitter } from '../Engine/main.js'
export class UIBase {
    constructor() {
        this.position = { x:0, y:0 };
        this.hidden = true;
        this.worldCoords = true; // Set true if position is in world coords rather than screen position
        this.removeOnClose = false; // Set true if want to delete after closing, ie not a recurring ui
        this.onclose = new EventEmitter();
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
            this.dom.style.marginLeft = `-${Math.floor(this.dom.offsetWidth/2)}px`
            this.dom.style.marginTop = `-${Math.floor(this.dom.offsetHeight/2)}px`

        }
    }
    close() {
        this.onclose.call();
        if(this.removeOnClose) {
            this.remove()
        } else {
            this.hidden = true;
        }
    }
    remove() {
        UIBase.list.splice(UIBase.list.indexOf(this), 1);
        removeDOM(this.dom);
    }
    show() {
        this.hidden = false;
    }
    hide() {
        this.hidden = true;
    }
    static updateAll() {
        UIBase.list.map(u => u.update())
    }
}
UIBase.list = [];