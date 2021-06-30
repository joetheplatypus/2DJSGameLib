export class Text {
    constructor(text) {
        this.text = text;
        this.dom = null;
    }
    createDOM() {
        const t = document.createElement('p');
        t.className = 'UIKitText'
        t.innerText = this.text;
        this.dom = t;
        return t;
    }
    update(text) {
        this.text = text;
        if(this.dom) {
            this.dom.innerText = text;
        }
    }
}