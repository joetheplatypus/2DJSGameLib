export default class Expanding2DArray {
    constructor() {
        this.arr = [[]]
        this.defaultValue = null
    }
    set(i,j,val) {
        // Add rows
        while(this.arr.length <= j) {
            this.arr.push((new Array(this.arr[0].length)).fill(this.defaultValue))
        }
        // Add cols
        while(this.arr[0].length <= i) {
            this.arr.map(row => {
                row.push(this.defaultValue)
            })
        }
        // Set
        this.arr[j][i] = val
    }
    get(i,j) {
        if(this.arr.length <= i) {
            return this.defaultValue
        }
        if(this.arr[0].length <= j) {
            return this.defaultValue
        }
        return this.arr[j][i]
    }
    toArray() {
        return this.arr
    }
}