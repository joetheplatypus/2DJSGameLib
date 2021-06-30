export class Text {
    constructor(text) {
        this.text = text;
    }
    createDOM() {
        const t = document.createElement('p');
        t.className = 'UIKitText'
        t.innerText = this.text;
        return t;
    }
}