export class Title {
    constructor(text) {
        this.text = text;
    }
    createDOM() {
        const t = document.createElement('h1');
        t.innerText = this.text;
        return t;
    }
}