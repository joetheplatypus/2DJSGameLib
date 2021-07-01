export class Table {
    constructor(array = [[]], headers = []) {
        this.array = array;
        this.headers = headers;
        this.dom = null;
    }
    createDOM() {
        const table = document.createElement('div');
        table.className = 'UIKitTable'
        if(this.headers.length > 0) {
            const headerRow = document.createElement('div')
            headerRow.className = 'UIKitTableHeader'
            for(let j = 0; j < this.headers.length; j++) {
                const cell = document.createElement('div');
                cell.className = 'UIKitTableCell'
                cell.innerText = this.headers[j];
                headerRow.appendChild(cell);
            }
            table.appendChild(headerRow)
        }
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
        }
        this.dom = table;
        return this.dom;
    }
    update(array, headers = []) {
        this.array = array;
        if(this.dom) {
            this.dom.innerHTML = '';
            if(this.headers.length > 0) {
                const headerRow = document.createElement('div')
                headerRow.className = 'UIKitTableHeader'
                for(let j = 0; j < this.headers.length; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'UIKitTableCell'
                    cell.innerText = this.headers[j];
                    headerRow.appendChild(cell);
                }
                this.dom.appendChild(headerRow)
            }
            for(let i = 0; i < this.array.length; i++) {
                const row = document.createElement('div')
                for(let j = 0; j < this.array[i].length; j++) {
                    const cell = document.createElement('div');
                    cell.innerText = this.array[i][j];
                    row.appendChild(cell);
                }
                this.dom.appendChild(row)
            }
        }
    }
}