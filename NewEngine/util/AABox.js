import { Vector } from './Vector.js'

// Utility class for storing an axis-aligned bounding box.
export class AABox {

    constructor(tl,br) {
        this.tl = { x:tl.x, y:tl.y };
        this.br = { x:br.x, y:br.y };
    }

    // Returns whether the given point {x,y} is within the bounds of the box
    contains({x,y}) {
        if(x >= this.tl.x && x <= this.br.x && y <= this.br.y && y >= this.tl.y) {
            return true;
        }
        return false;
    }

    // Returns whether two boxes intersect.
    intersects(box) {
        if(!box instanceof AABox) {
            console.warn('Cannot check for intersection with non AABox')
            return false;
        }
        if(this.br.x >= box.tl.x && this.tl.x <= box.br.x && this.br.y >= box.tl.y && this.tl.y <= box.br.y) {
            return true;
        }
        return false;
    }

    // Gets centre point
    center() {
        const x = (this.tl.x+this.br.x)/2
        const y = (this.tl.y+this.br.y)/2
        return new Vector(x,y)
    }

    width() {
        return this.br.x - this.tl.x
    }

    height() {
        return this.br.y - this.tl.y
    }

    static fromPoly(poly) {
        const n = poly.nodes
        const l = Math.min(...n.map(a => a.x))
        const r = Math.max(...n.map(a => a.x))
        const t = Math.min(...n.map(a => a.y))
        const b = Math.max(...n.map(a => a.y))
        const tl = new Vector(l,t)
        const br = new Vector(r,b)
        return new AABox(tl,br)
    }
}