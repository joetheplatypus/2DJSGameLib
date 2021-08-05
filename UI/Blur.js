import { addDOM } from "./util.js";

class Blur  {
    constructor() {
        this.dom = null;
    }
    createDOM() {
        const a = document.createElement('div');
        a.className = 'UIKitBlur'
        a.style.display = 'none';
        return a;
    }
    on() {
        if(!this.dom) {
            this.dom = this.createDOM();
            addDOM(this.dom);
        }
        
        this.dom.style.display = 'inline'
    }
    off() {
        this.dom.style.display = 'none'
    }
}

export default new Blur()