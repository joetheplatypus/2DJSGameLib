import { addDOM } from "./util.js";

class Blur  {
    constructor() {
        this.dom = this.createDOM();
        addDOM(this.dom);
    }
    createDOM() {
        const a = document.createElement('div');
        a.className = 'UIKitBlur'
        a.style.display = 'none';
        return a;
    }
    on() {
        this.dom.style.display = 'inline'
    }
    off() {
        this.dom.style.display = 'none'
    }
}

export default new Blur()