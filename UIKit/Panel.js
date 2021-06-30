import { UIBase } from "./UIBase";

export class Panel extends UIBase {
    constructor() {
        super()
    }
    createDOM() {
        const div = document.createElement('div');
        div.className = 'UIKitPanel'
        div.style.minWidth = '300px';
        div.style.minHeight = '500px';
        div.style.marginLeft = '-150px';
        div.style.marginTop = '-250px';
        div.style.top = this.position.y;
        div.style.left = this.position.x;

        const close = document.createElement('div');
        close.className = 'close'
        close.innerHTML = '<i class="material-icons icon-med">close</i>'
        close.onclick = () => { console.log('a'); this.hidden = true }

        div.appendChild(close);
        return div;
    }
}