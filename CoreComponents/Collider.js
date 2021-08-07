import { Component, AABox, Vector } from "../Engine/main.js";

export class Collider extends Component {
    constructor(go, type) {
        super(go)
        this.type = type
        this.dimensions = new Vector()
        this.position_delta = new Vector()
    }
    getAABox() {
        return AABox.fromPoly(this.getCollider())
    }
    getCollider() {
        const pos = this.go.position;
        const cpd = this.position_delta
        const c = Math.cos(this.go.rotation);
        const s = Math.sin(this.go.rotation);
        // local bounds
        const ltl = { x:-this.dimensions.x/2, y:-this.dimensions.y/2 };
        const lbr = { x:this.dimensions.x/2, y:this.dimensions.y/2 };
        const ltr = { x:this.dimensions.x/2, y:-this.dimensions.y/2 };
        const lbl = { x:-this.dimensions.x/2, y:this.dimensions.y/2 };
        // convert to global
        const gtl = { x:c*ltl.x - s*ltl.y + pos.x + cpd.x, y:s*ltl.x + c*ltl.y + pos.y + cpd.y };
        const gbr = { x:c*lbr.x - s*lbr.y + pos.x + cpd.x, y:s*lbr.x + c*lbr.y + pos.y + cpd.y };
        const gtr = { x:c*ltr.x - s*ltr.y + pos.x + cpd.x, y:s*ltr.x + c*ltr.y + pos.y + cpd.y };
        const gbl = { x:c*lbl.x - s*lbl.y + pos.x + cpd.x, y:s*lbl.x + c*lbl.y + pos.y + cpd.y };
        return new Polygon(gtl, gtr, gbr, gbl);
    }
    static partition(size) {
        let list = Entity.allWith(Collider)
        // Need to shift for 0-indexing to account for negative positions
        const shiftX = -Math.min(...list.map(g => g.getComponent(Collider).getAABox().tl.x),0) + size;
        const shiftY = -Math.min(...list.map(g => g.getComponent(Collider).getAABox().tl.y),0) + size;
        // Put into a 2D array
        const partitions = new util.Expanding2DArray([]);
        list.map(go => {
            const collider = go.getComponent(Collider)
            const aabox = collider.getAABox()
            const top = Math.floor((aabox.tl.y + shiftY) / size);
            const bottom = Math.floor((aabox.br.y + shiftY) / size);
            const left = Math.floor((aabox.tl.x + shiftX) / size);
            const right = Math.floor((aabox.br.x + shiftX) / size);
            for(let i=left; i<=right; i++) {
                for(let j=top; j<=bottom; j++) {
                    const arr = partitions.get(i,j)
                    if(arr.length === 0) {
                        partitions.set(i,j,[go])
                    } else {
                        arr.push(go)
                    }
                }
            }
        })
        return partitions.toArray()
    }
    
    
}

Collider.ColliderTypes = {
    // Axis-Aligned Bounding Box
    AABox: 'AABox',
    // Box with rotation
    Box:'Box',
    // Simple circle collider using avg of width and height as diameter
    Circle:'Circle',
}