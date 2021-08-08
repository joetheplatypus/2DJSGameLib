export class Vector {
    
    // Initialise vector using {x,y}, array or parameters
    constructor(param1, param2) {
        if(typeof param1 === 'number' && typeof param2 === 'number') {
            this.x = param1;
            this.y = param2;
        } else if(param1 instanceof Array) {
            this.x = param1[0];
            this.y = param1[1];
        } else if(param1 instanceof Object) {
            this.x = param1.x || 0;
            this.y = param1.y || 0;
        } else {
            this.x = 0;
            this.y = 0;
        }
    }
    set(x,y) {
        this.x = x;
        this.y = y;
    }
    scale(t) {
        return new Vector(this.x * t, this.y * t);
    } 
    equals(v) {
        return (this.x === v.x && this.y === v.y);
    }
    distSq(v) {
        return Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2);
    }
    dist(v) {
        return Math.sqrt(this.distSq(v));
    }
    modSq() {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }
    mod() {
        return Math.sqrt(this.modSq());
    }
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    minus(v) {
        return this.add(v.scale(-1));
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    normalise() {
        if(this.modSq() !== 1) {
            const r = this.mod();
            return this.scale(1/r);
        } else {
            return new Vector(this)
        }
    }
    abs() {
        return new Vector(Math.abs(this.x), Math.abs(this.y));
    }
    angle() {
        return Math.atan2(this.y, this.x)
    }
    floor() {
        return new Vector(Math.floor(this.x), Math.floor(this.y))
    }
    copy() {
        return new Vector(this)
    }
    rotate(angle, clockwise = false) {
        const res = new Vector()
        if(clockwise) {
            res.x = Math.cos(angle)*this.x + Math.sin(angle)*this.y
            res.y = -Math.sin(angle)*this.x + Math.cos(angle)*this.y
        } else {
            res.x = Math.cos(angle)*this.x - Math.sin(angle)*this.y
            res.y = Math.sin(angle)*this.x + Math.cos(angle)*this.y
        }
        return res
    }
    
    // Hadamard product
    had(v) {
        return new Vector(this.x * v.x, this.y * v.y);
    }

    // Returns raw object. Useful for serialisation
    toObj() {
        return { x:this.x, y:this.y }
    }

    // Removes scalar multiples in a list of vectors.  Useful in SAT
    static removeScalarMultiples(list) {
        const newList = []
        for(let i=0; i<list.length; i++) {
            let toAdd = true
            for(let j=i+1; j<list.length; j++) {
                const k1 = list[i].x / list[j].x
                const k2 = list[i].y / list[j].y
                if(k1 === k2) {
                    toAdd = false
                }
            }
            if(toAdd) {
                newList.push(list[i])
            }
        }
        return newList
    }

}

// Please dont mutate these...
Vector.up = new Vector(0,-1);
Vector.down = new Vector(0,1);
Vector.left = new Vector(-1,0);
Vector.right = new Vector(1,0);
Vector.zero = new Vector(0,0);