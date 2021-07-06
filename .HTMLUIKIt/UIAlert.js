import DOM from './DOM.js'

export class UIAlert {
    constructor(text, timer) {
        this.text = text;
        this.timer = timer;
        this.createDom();
    }
    createDom() {
        this.dom = document.createElement('div');
        this.dom.className = 'UIAlert'
        this.dom.innerText = this.text;

        setTimeout(() => {
            this.dom.style.animationName = 'fadeOut';
            setTimeout(() => {
                DOM.remove(this.dom)
            }, 2000)
        }, this.timer)

        DOM.add(this.dom);
        this.dom.style.marginTop = `-${this.dom.offsetHeight/2}px`;
    }
    static create(text, timer=1000) {
        const u = new UIAlert(text, timer);
    }
}