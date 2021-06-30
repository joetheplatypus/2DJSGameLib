export class Button {
    constructor(text, onclick) {
        this.text = text;
        this.onclick = onclick;
    }
    createDOM() {
        const t = document.createElement('button');
        t.className = 'UIKitButton'
        t.innerText = this.text;
        t.onclick = () => {this.onclick()}
        return t;
    }
}