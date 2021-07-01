export class Table {
    constructor(array = [[]]) {
        this.array = array;
        this.dom = null;
    }
    createDOM() {
        console.log(this.array)
        const table = document.createElement('div');
        table.className = 'UIKitTable'
        for(let i = 0; i < this.array.length; i++) {
            const row = document.createElement('div')
            row.className = 'UIKitTableRow'
            for(let j = 0; j < this.array[i].length; j++) {
                const cell = document.createElement('div');
                cell.className = 'UIKitTableCell'
                cell.innerText = this.array[i][j];
                row.appendChild(cell);
            }
            table.appendChild(row)
            this.dom = table;
            return this.dom;
        }
    }
    update(array) {
        this.array = array;
        if(this.dom) {
            this.dom.innerHTML = '';
            for(let i = 0; i < this.array.length; i++) {
                const row = document.createElement('div')
                for(let j = 0; j < this.array[i].length; j++) {
                    const cell = document.createElement('div');
                    cell.innerText = this.array[i][j];
                    row.appendChild(cell);
                }
                this.dom.appendChild(row)
                return this.dom;
            }
        }
    }
}