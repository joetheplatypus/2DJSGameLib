import DOM from './DOM.js'
import UIList from './UIList.js'

export class UITablePanel {
    constructor(position) {
        this.position = position;
        this.text = '';
        this.table = [[]];
        this.icons = []
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

        const iconDiv = document.createElement('div');
        iconDiv.className = 'row UIKitIconRow'
        this.iconDiv = iconDiv;

        this.icons.map(icon => {
            const colDiv = document.createElement('div');
            colDiv.className = 'column'
            colDiv.innerHTML = '<i class="material-icons icon-med">pets</i>'
            iconDiv.appendChild(colDiv);
        })

        const tableDataDiv = document.createElement('div');
        tableDataDiv.className = ''
        this.tableDiv = tableDataDiv;

        const numCols = this.table[0].length;
        const numRows = this.table.length;
        for(let i = 0; i < numRows; i++) {
            const row = document.createElement('div');
            row.className = 'row UIKitDataRow'
            for(let j = 0; j < numCols; j++) {
                const col = document.createElement('div');
                col.className = 'column'
                col.innerText = this.table[i][j];
                row.appendChild(col);
            }
            tableDataDiv.appendChild(row);
        }

        tableDiv.appendChild(iconDiv)
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
    setIcons(icons) {
        this.icons = icons;
        
        // Clear
        this.iconDiv.innerHTML = ''

        // Fill Icons
        this.icons.map(icon => {
            const colDiv = document.createElement('div');
            colDiv.className = 'column'
            colDiv.innerHTML = `<i class="material-icons icon-med">${icon}</i>`
            this.iconDiv.appendChild(colDiv);
        })
    }
    setTable(table) {
        this.table = table

        // Clear
        this.tableDiv.innerHTML = ''

        const numCols = this.table[0].length;
        const numRows = this.table.length;
        for(let i = 0; i < numRows; i++) {
            const row = document.createElement('div');
            row.className = 'row UIKitDataRow'
            for(let j = 0; j < numCols; j++) {
                const col = document.createElement('div');
                col.className = 'column'
                col.innerText = this.table[i][j];
                row.appendChild(col);
            }
            this.tableDiv.appendChild(row);
        }
    }
    static create(position, title, icons, table) {
        const tp = new UITablePanel(position);
        tp.persist = false;
        tp.setText(title);
        tp.setIcons(icons);
        tp.setTable(table);
        tp.show()
    }
}