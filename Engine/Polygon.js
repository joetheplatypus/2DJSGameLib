import { Vector } from './Vector.js'

export class Polygon {

    // Collection of points {x,y} in CLOCKWISE direction.
    constructor(...nodes) {
        this.nodes = nodes;
        this.repNodes = [...nodes, nodes[0]]
    }

    // Gets list of normalised tangents as vectors
    tangents() {
        // get tangents
        let tangents = [];
        for(let i = 0; i < this.nodes.length; i++) {
            tangents.push(new Vector({
                x: this.repNodes[i+1].x - this.repNodes[i].x,
                y: this.repNodes[i+1].y - this.repNodes[i].y,
            }))
        }
        // normalise
        return tangents.map((v) => v.normalise());
    }

    // Gets list of normalised normals as vectors
    normals() {
        // rotate tangents A/C to get normals
        return this.tangents().map((v) => {
            return new Vector({ x: v.y, y: -v.x });
        })
    }

    // Project the polygon along an axis line defined by {x,y}.  Used in SAT.
    project({x,y}) {
        let min = this.nodes[0].x * x + this.nodes[0].y * y;
        let max = min;
        for(let i = 1; i < this.nodes.length; i++) {
            let p = this.nodes[i].x * x + this.nodes[i].y * y;
            if(p < min) {
                min = p;
            } else if(p > max) {
                max = p;
            }
        }
        return [min,max]
    }

    // Creates poly from axis-aligned bounding box
    static fromAABox(box) {
        const tl = box.tl
        const tr = {x:box.br.x, y:box.tl.y}
        const bl = {x:box.tl.x, y:box.br.y}
        const br = box.br
        return new Polygon(tl, tr, br, bl)
    }

}