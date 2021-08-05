export class Title {
    constructor(text) {
        this.text = text;
    }
    createDOM() {
        const t = document.createElement('h1');
        t.className = 'UIKitTitle'
        t.innerText = this.text;
        return t;
    }
}