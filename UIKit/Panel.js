import { UIBase } from "./UIBase.js";
import { getCamera } from './util.js'

export class Panel extends UIBase {
    constructor() {
        super()
    }
    createDOM() {
        // Container
        const div = document.createElement('div');
        div.className = 'UIKitPanel'
        // div.style.minWidth = '300px';
        // div.style.minHeight = '500px';
        div.style.marginLeft = '-150px';
        div.style.marginTop = '-250px';

        // Positioning
        if(this.worldCoords) {
            const screenPos = getCamera().to(this.position)
            div.style.top = screenPos.y;
            div.style.left = screenPos.x;
        } else {
            div.style.top = this.position.y;
            div.style.left = this.position.x;
        }
        
        // Close
        const close = document.createElement('div');
        close.className = 'close'
        close.innerHTML = '<i class="material-icons icon-med">close</i>'
        close.onclick = () => { this.close(); }
        div.appendChild(close);

        // Components
        this.components = [];
        this.contentDOM = document.createElement('div')
        this.contentDOM.className = 'UIKitContent'
        this.componentDOMs = this.components.map(c => c.createDOM());
        this.componentDOMs.map(c => {
            const row = document.createElement('div')
            row.className = 'UIKitContentRow'
            row.appendChild(c)
            this.contentDOM.appendChild(row)
        });
        div.appendChild(this.contentDOM);

        return div;
    }
    addComponent(classs, ...args) {
        const comp = new classs(...args);
        this.components.push(comp);
        const dom = comp.createDOM();
        this.componentDOMs.push(dom);
        this.contentDOM.appendChild(dom)
    }
}