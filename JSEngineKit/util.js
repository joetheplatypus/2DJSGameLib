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