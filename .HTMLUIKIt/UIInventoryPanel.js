import { Spritesheet, Sprite } from '../HTMLRenderKit/main.js';
import { Item } from '../JSInventoryKit/main.js';
import DOM from './DOM.js'
import UIList from './UIList.js'

export class UIInventoryPanel {
    constructor(position) {
        this.position = position;
        this.text = '';
        this.dragIdent = '' + Math.random() //used to identify self-dragging
        this.items = [];
        this.inventory = null;
        this.addCB = ([item,amount]) => {return true;};
        this.removeCB = (index) => {return true;};
        this.persist = true;
        this.createDom();
        UIList.add(this);
    }
    createDom() {   
        const div = document.createElement('div');
        div.className = 'UIKitPanel'
        div.style.top = this.position.y;
        div.style.left = this.position.x;
        div.ondrop = (e) => {this.onDrop(e)}
        div.ondragenter = (e) => {return true}
        div.ondragover = (e) => {return false}

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
                const sprite = this.items[i*numCols + j][0];
                col.innerHTML = `<div style="background: url('${sprite.sheet}') -${sprite.pos.x}px -${sprite.pos.y}px" width="${sprite.dim.w}" height="${sprite.dim.h}"></div>`
                col.setAttribute('draggable',true)
                col.ondragstart = (e) => {console.log(e)}
                row.appendChild(col);
            }
            tableDataDiv.appendChild(row);
        }

        tableDiv.appendChild(tableDataDiv)
        div.appendChild(tableDiv)

        const binDiv = document.createElement('div');
        binDiv.className = 'row UIKitInventoryBin align-centre'
        binDiv.style.display = 'none'
        binDiv.ondrop = (e) => {this.onBinDrop(e)}
        binDiv.ondragenter = (e) => {return true}
        binDiv.ondragover = (e) => {return false}
        binDiv.innerHTML = '<i class="material-icons icon-med white">delete</i>'
        this.binDiv = binDiv
        div.appendChild(binDiv)

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
    onBinDrop(event) {
        const origin = UIInventoryPanel.fromDragIdent(event.dataTransfer.getData('origin'))
        origin.onDraggedFrom(event.dataTransfer.getData('index'))
        this.binDiv.style.display = 'none'
    }
    onDrop(event) {
        if(event.dataTransfer.getData('origin') != this.dragIdent) {
            const item = event.dataTransfer.getData('item')
            const count = parseInt(event.dataTransfer.getData('count'));
            if(this.addCB([item,count])) {
                const origin = UIInventoryPanel.fromDragIdent(event.dataTransfer.getData('origin'))
                if(origin.onDraggedFrom(event.dataTransfer.getData('index'))) {
                    this.inventory.add(item, count)
                }
            }
        }
    }
    onDragStart(event, index) {
        event.dataTransfer.setData('index', index)
        event.dataTransfer.setData('item',this.items[index][0]);
        event.dataTransfer.setData('count',this.items[index][1]);
        event.dataTransfer.setData('origin',this.dragIdent);
        this.binDiv.style.display = 'flex'
    }
    onDragEnd() {
        this.binDiv.style.display = 'none'
    }
    onDraggedFrom(index) {
        if(this.removeCB(index)) {
            this.inventory.removeSlot(index);
            return true
        }
        return false
    }
    setInventory(inventory) {
        this.setItems(inventory.itemSlots);
        inventory.onchange.add(() => {
            this.setItems(inventory.itemSlots);
        })
        this.inventory = inventory;
    }
    setItems(items) {
        this.items = JSON.parse(JSON.stringify(items))

        // Clear
        this.tableDiv.innerHTML = ''

        const numRows = Math.max(Math.floor(Math.sqrt(this.items.length)),1);
        const numCols = Math.max(Math.ceil(this.items.length / numRows),2);

        for(let i = 0; i < numRows; i++) {
            const row = document.createElement('div');
            row.className = 'row'
            for(let j = 0; j < numCols; j++) {
                
                if(i*numCols + j < this.items.length) {
                    const col = document.createElement('div');
                    col.className = 'UIKitInventoryBox column '
                    const item = Item.fromName(this.items[i*numCols + j][0]);
                    const sprite = Sprite.fromName(item.sprite);
                    const sheet = Spritesheet.fromName(sprite.sheet);
                    col.innerHTML = `<div style="background: url('${sheet.path}') -${sprite.pos.x}px -${sprite.pos.y}px; width: ${sprite.dim.w}; height: ${sprite.dim.h}; zoom: 0.3"></div>`
                    col.setAttribute('draggable',true)
                    col.ondragstart = (e) => {this.onDragStart(e, i*numCols + j)}
                    col.ondragend = (e) => {this.onDragEnd()} 
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
    setAddCB(cb) {
        this.addCB = cb;
    }
    setRemoveCB(cb) {
        this.removeCB = cb;
    }
    static fromDragIdent(ident) {
        const list = UIList.list.filter(i => i instanceof UIInventoryPanel);
        return list.find(i => i.dragIdent == ident);
    }
    static create(position, title, inventory, addCB, removeCB) {
        const tp = new UIInventoryPanel(position);
        tp.persist = false;
        tp.setText(title);
        tp.setInventory(inventory)
        if(addCB !== undefined) {
            tp.setAddCB(addCB);
        }
        if(removeCB !== undefined) {
            tp.setRemoveCB(removeCB);
        }
        
        
        tp.show()
    }
}