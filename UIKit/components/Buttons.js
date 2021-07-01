export class Buttons {
    constructor(...array) {
        if(array.length % 2 !== 0) {
            console.error('invalid button array must be name,callback,name,callback...')
        }
        this.array = array;
    }
    createDOM() {
        const d = document.createElement('div')
        d.className = 'UIKitButtonRow'
        for(let i = 0; i < this.array.length; i += 2) {
            const t = document.createElement('button');
            t.className = 'UIKitButton'
            t.innerText = this.array[i];
            t.onclick = () => {this.array[i+1]()}
            d.appendChild(t);
        }       
        return d;
    }
}