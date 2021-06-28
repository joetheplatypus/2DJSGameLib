// export default {
//     dot(v1, v2) {
//         return v1.x * v2.x + v1.y * v2.y
//     },
//     scale(v, t) {
//         return v.map(e => e*t);
//     },
//     equal(v1, v2) {
//         return (v1[0] === v2[0] && v1[1] === v2[1]);
//     },
//     distanceSq(v1,v2) {
//         return Math.pow(v1[0] - v2[0]) + Math.pow(v1[1] - v2[1])
//     },
//     lengthSq(v1) {
//         return Math.pow(v1[0], 2) + Math.pow(v1[1], 2)
//     },
//     length(v1) {
//         return Math.sqrt(this.lengthSq(v1));
//     },
//     posDistSq(v1,v2) {
//         return Math.pow(v1.x - v2.x,2) + Math.pow(v1.y - v2.y,2)
//     },
//     add(v1,v2) {
//         return [v1[0]+v2[0],v1[1]+v2[1]];
//     },
//     minus(v1,v2) {
//         return this.add(v1, this.scale(v2,-1))
//     },
//     normalise(v) {
//         const r = this.length(v);
//         return this.scale(v, 1/r)
//     },
//     down: [0,1],
//     up: [0,-1],
//     left: [-1,0],
//     right: [1,0]
// }

export class Vector {
    
    // Initialise vector using {x,y} array or parameters
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
        console.log(param1,param2,this.x,this.y)
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