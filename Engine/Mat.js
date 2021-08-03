import { Vector } from "./Vector.js";

// 2x2 matrix math
export class Mat {
    
    constructor(p1,p2,p3,p4) {
        if(p1 instanceof Mat) {
            this.a = p1.a;
            this.b = p1.b;
            this.c = p1.c;
            this.d = p1.d;
        } else if(p1 instanceof Array && p1[0] instanceof Array) {
            this.a = p1[0][0];
            this.b = p1[0][1];
            this.c = p1[1][0];
            this.d = p1[1][1];
        } else if(p1 instanceof Array && p1.length === 4) {
            this.a = p1[0];
            this.b = p1[1];
            this.c = p1[2];
            this.d = p1[3];
        } else if(p1 instanceof Object && p2 instanceof Object) {
            this.a = p1.x || 0;
            this.b = p2.x || 0;
            this.c = p1.y || 0;
            this.d = p2.y || 0;
        } else if(typeof p1 === 'number') {
            this.a = p1;
            this.b = p2;
            this.c = p3;
            this.d = p4;
        } else {
            this.a = 0;
            this.b = 0;
            this.c = 0;
            this.d = 0;
        }
    }
    det() {
        return this.a*this.d - this.b*this.c
    }
    inv() {
        const d = this.det();
        if(d === 0) {
            console.warn('Cannots invert a non-invertible matrix')
            return null
        }
        return this.cofactors().scale(1/d);
    }
    transpose() {
        return new Mat(
            this.a, this.c,
            this.b, this.d
        )
    }
    minors() {
        return new Mat(
            this.d, this.b,
            this.c, this.a
        )
    }
    cofactors() {
        return new Mat(
            this.d, -this.b,
            -this.c, this.a
        )
    }
    scale(t) {
        return new Mat(
            this.a*t, this.b*t,
            this.c*t, this.d*t
        )
    }

    // Dot product to apply matrix transformation to vector or matrix.  Returns input type.
    dot(m) {
        if(m instanceof Vector) {
            return new Vector(this.a*m.x + this.b*m.y, this.c*m.x + this.d*m.y);
        } else if(m instanceof Mat) {
            return new Mat(
                this.a*m.a + this.b*m.c, this.a*m.b + this.b*m.d,
                this.c*m.a + this.d*m.c, this.c*m.b + this.d*m.d,
            )
        }
    }

}