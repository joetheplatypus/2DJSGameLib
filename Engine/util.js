export const util =  {

    // Enhances infix modulo operator ensuring always returns a positive value.
    mod(n, m) {
        return ((n % m) + m) % m;
    },

    // Clamps input x between and including [min,max]
    clamp(x, min, max) {
        if(min !== null && x < min) return min;
        if(max !== null && x > max) return max;
        return x;
    },

    // Convert flat array into 2d array given width/height.  Fills cells to create rectangle with filler.
    to2d(arr, width, fill = null) {
        const res = [];
        for (let i = 0; i < arr.length; i += width) {
            const row = arr.slice(i, i + width);
            while(row.length < width) {
                row.push(fill);
            }
            res.push(row)
        }
        return res;
    },

    // Returns average of parameters
    avg(...x) {
        return x.reduce((a,b) => a+b, 0)/x.length
    },

    // Gets the overlap between two intervals.  Used in SAT
    overlap([m1, M1], [m2, M2]) {
        if(m1 > M2 || m2 > M1) {
            return 0
        }
        return Math.min(M1,M2) - Math.max(m1,m2)
    },

    // Useful class for pseudo-infinite sized arrays
    Expanding2DArray: class  {
        constructor(defaultValue = null) {
            this.arr = [[]]
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
            // Returns default value if outside range
            if(this.arr.length <= j) {
                return this.defaultValue
            }
            if(this.arr[0].length <= i) {
                return this.defaultValue
            }
            return this.arr[j][i]
        }
        toArray() {
            return this.arr
        }
    },

    // Sets window resize func to resize the given canvas and camera
    resizeWindow(canvas, camera) {
        const f = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if(camera) {
                camera.dimensions.w = canvas.width;
                camera.dimensions.h = canvas.height;
            }   
        }
        window.onresize = () => f();
        f()
    },
}


