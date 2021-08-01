// Enhances infix modulo operator ensuring always returns a positive value.
export function mod(n, m) {
    return ((n % m) + m) % m;
}

// Clamps input x between and including [min,max]
export function clamp(x, min, max) {
    if(min !== null && x < min) return min;
    if(max !== null && x > max) return max;
    return x;
}

// Grows 2D array with value until the index (i,j) exists
export function grow2d(arr,x,y,value = null) {
    for(let i = 0; i < arr.length; i++) {
        for(let j = arr[i].length; j <= y; j++) {
            arr[i].push(value);
        }
    }
    for(let i = arr.length - 1; i <= x; i++) {
        const row = [];
        for(let j = 0; j <= y; j++) {
            row.push(value);
        }
        arr.push(row);
    }
}

// Convert flat array into 2d array given width/height.  Fills cells to create rectangle with filler.
export function to2d(arr, width, fill = null) {
    const res = [];
    for (let i = 0; i < arr.length; i += width) {
        const row = arr.slice(i, i + width);
        while(row.length < width) {
            row.push(fill);
        }
        res.push(row)
    }
    return res;
}

export function avg(...x) {
    return x.reduce((a,b) => a+b, 0)/x.length
}

export function overlap([m1, M1], [m2, M2]) {
    if(m1 > M2 || m2 > M1) {
        return 0
    }
    return Math.min(M1,M2) - Math.max(m1,m2)
}

export class Expanding2DArray {
    constructor(defaultValue = null) {
        this.arr = [[defaultValue]]
        this.defaultValue = defaultValue
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