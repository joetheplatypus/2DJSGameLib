import DOM from './DOM.js'
import UIList from './UIList.js'

export class UIStaticInventoryPanel {
    constructor(position) {
        this.position = position;
        this.text = '';
        this.items = [];
        this.persist = true;
        this.createDom();
        UIList.add(this);
    }
    createDom() {   
        const div = document.createElement('div');
        div.className = 'UIKitPanel'
        div.style.top = this.position.y;
        div.style.left = this.position.x;

        const close = document.createElement('div');
        close.className = 'close'
        close.innerHTML = '<i class="material-icons icon-med">close</i>'
        close.onclick = () => { this.hide() }
        div.appendChild(close);

        const textDiv = document.createElement('div');
        textDiv.className = 'UIKitTitle row'
        textDiv.innerText = this.text;
        div.appendChild(textDiv)
        this.textDiv = textDiv;

        const tableDiv = document.createElement('div');
        tableDiv.className = 'UIKitTable'

        const tableDataDiv = document.createElement('div');
        tableDataDiv.className = ''
        this.tableDiv = tableDataDiv;

        const numRows = Math.floor(Math.sqrt(this.items.length));
        const numCols = Math.ceil(this.items.length / numRows);

        for(let i = 0; i < numRows; i++) {
            const row = document.createElement('div');
            row.className = 'row UIKitDataRow'
            for(let j = 0; j < numCols; j++) {
                const col = document.createElement('div');
                col.className = 'column'
                col.innerText = `<i class="material-icons icon-med">${this.items[i*numCols + j][0]}</i>`
                row.appendChild(col);
            }
            tableDataDiv.appendChild(row);
        }

        tableDiv.appendChild(tableDataDiv)
        div.appendChild(tableDiv)

        this.dom = div;
        this.hide();
        DOM.add(this.dom);
    }
    show() {
        this.dom.style.display = 'inline-block';
    }
    hide() {
        this.dom.style.display = 'none';
        if(!this.persist) {
            this.remove()
        }
    }
    remove() {
        UIList.remove(this)
        DOM.remove(this.dom)
    }
    update() {
        if(this.dom) {
            // position
            const screenPos = DOM.project(this.position)
            this.dom.style.top = screenPos.y;
            this.dom.style.left = screenPos.x;
            // offset for centering
            this.dom.style.marginLeft = `-${this.dom.offsetWidth/2}px`;
            this.dom.style.marginTop = `-${this.dom.offsetHeight/2}px`;           
        }
    }
    setText(text) {
        this.text = text;
        this.textDiv.innerText = this.text;
    }
    setItems(items) {
        this.items = items

        // Clear
        this.tableDiv.innerHTML = ''

        const numCols = Math.ceil(Math.sqrt(this.items.length));
        const numRows = Math.ceil(this.items.length / numCols);

        for(let i = 0; i < numRows; i++) {
            const row = document.createElement('div');
            row.className = 'row'
            for(let j = 0; j < numCols; j++) {
                
                if(i*numCols + j < this.items.length) {
                    const col = document.createElement('div');
                    col.className = 'UIKitInventoryBox column '
                    col.innerHTML = `<i class="material-icons icon-med">${this.items[i*numCols + j][0]}</i>`
                    const num = this.items[i*numCols + j][1]
                    if(num > 1) {
                        const p = document.createElement('p')
                        p.className = 'UIKitInventoryItemCounter'
                        p.innerText = 'x' + num;
                        col.appendChild(p);
                    }
                    row.appendChild(col);
                } else {
                    const col = document.createElement('div');
                    col.className = 'UIKitInventoryBox column disabled col-centre'
                    col.innerHTML = `-`
                    row.appendChild(col);
                }
                
            }
            this.tableDiv.appendChild(row);
        }
    }
    static create(position, title, items) {
        const tp = new UIStaticInventoryPanel(position);
        tp.persist = false;
        tp.setText(title);
        tp.setItems(items);
        tp.show()
    }
}