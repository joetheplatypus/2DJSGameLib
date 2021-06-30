import { UIBase } from "./UIBase.js";
import { getCamera } from './util.js'

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
        if(this.worldCoords) {
            const screenPos = getCamera().to(this.position)
            div.style.top = screenPos.y;
            div.style.left = screenPos.x;
        } else {
            div.style.top = this.position.y;
            div.style.left = this.position.x;
        }
        

        const close = document.createElement('div');
        close.className = 'close'
        close.innerHTML = '<i class="material-icons icon-med">close</i>'
        close.onclick = () => { this.hidden = true }

        div.appendChild(close);
        return div;
    }
}