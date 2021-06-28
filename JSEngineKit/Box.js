// Utility class for storing an axis-aligned bounding box.
export class Box {

    constructor(tl,br) {
        this.tl = { x:tl.x, y:tl.y };
        this.br = { x:br.x, y:br.y };
    }

    // Returns whether the given point {x,y} is within the bounds of the box
    contains(point) {
        if(point.x >= this.tl.x && point.x <= this.br.x && point.y <= this.br.y && point.y >= this.tl.y) {
            return true;
        }
        return false;
    }

    // Returns whether two boxes intersect.
    intersects(box) {
        if(this.br.x >= box.tl.x && this.tl.x <= box.br.x && this.br.y >= box.tl.y && this.tl.y <= box.br.y) {
            return true;
        }
        return false;
    }
}