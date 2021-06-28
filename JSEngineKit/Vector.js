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
        const r = this.mod();
        return this.scale(1/r);
    }
    abs() {
        return new Vector(Math.abs(this.x), Math.abs(this.y));
    }
    had(v) {
        return new Vector(this.x * v.x, this.y * v.y);
    }

}
Vector.up = new Vector(0,-1);
Vector.down = new Vector(0,1);
Vector.left = new Vector(-1,0);
Vector.right = new Vector(1,0);
Vector.zero = new Vector(0,0);