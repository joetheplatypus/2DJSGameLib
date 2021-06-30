export class KeyVal {
    constructor(keys, vals) {
        this.keys = keys;
        this.vals = vals;
        this.dom = null;
        if(this.keys.length !== this.vals.length) {
            console.error('Too many keys/vals')
        }
    }
    createDOM() {
        this.dom = document.createElement('div')
        for(let i = 0; i < this.keys.length; i++) {
            const row = document.createElement('p');
            row.innerHTML = `<span class="UIKitKey">${this.keys[i]}:&nbsp;</span><span class="UIKitVal">${this.vals[i]}</span>`
            this.dom.append(row);
        }
        return this.dom;
    }
    update(keys, vals) {
        if(this.keys.length !== this.vals.length) {
            console.error('Too many keys/vals')
            return;
        }
        this.keys = keys;
        this.vals = vals;
        this.dom.innerHTML = '';
        for(let i = 0; i < this.keys.length; i++) {
            const row = document.createElement('p');
            row.innerHTML = `<span class="UIKitKey">${this.keys[i]}:&nbsp;</span><span class="UIKitVal">${this.vals[i]}</span>`
            this.dom.append(row);
        }
    }
}