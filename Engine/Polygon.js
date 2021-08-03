import { Mat } from './Mat.js';
import { util } from './util.js';
import { Vector } from './Vector.js'

export class Polygon {

    // Collection of points {x,y} in CLOCKWISE direction.
    constructor(...nodes) {
        this.nodes = nodes;
        this.repNodes = [...nodes, nodes[0]]
    }

    center() {
        const x = util.avg(...this.nodes.map(n => n.x))
        const y = util.avg(...this.nodes.map(n => n.y))
        return new Vector(x,y)
    }

    // Gets list of normalised tangents as vectors
    tangents() {
        let tangents = [];
        for(let i = 0; i < this.nodes.length; i++) {
            tangents.push(new Vector({
                x: this.repNodes[i+1].x - this.repNodes[i].x,
                y: this.repNodes[i+1].y - this.repNodes[i].y,
            }))
        }
        return tangents.map((v) => v.normalise());
    }

    // Gets list of normalised normals as vectors
    normals() {
        return this.tangents().map(v => v.rotate(Math.PI/2))
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

    // Get the point on the edge of this polygon at the given angle from the center
    outerPoint(angle) {
        const intersectLine = new Vector(Math.cos(angle), Math.sin(angle))
        for(let i = 0; i < this.nodes.length; i++) {
            const tangentLine = new Vector({
                x: this.repNodes[i+1].x - this.repNodes[i].x,
                y: this.repNodes[i+1].y - this.repNodes[i].y,
            })
            const p = new Vector(this.nodes[i])
            const v = this.center().minus(p)
            const m = new Mat(
                tangentLine.x, -intersectLine.x,
                tangentLine.y, -intersectLine.y
            )
            const inv_m = m.inv()
            if(inv_m == null) continue;
            const { k,r } = inv_m.dot(v);
            if(k >= 0 && k <= 1 && r >= 0) {
                return this.center().add(intersectLine.scale(r))
            }
            // const x = this.center().x - this.nodes[i].x;
            // const y = this.center().y - this.nodes[i].y;
            // const a = tangentLine.x;
            // const b = -intersectLine.x;
            // const c = tangentLine.y;
            // const d = -intersectLine.y;
            // const det = a*d-b*c;
            // if(det === 0) continue;
            // const inv_a = (1/det) * d;
            // const inv_b = (1/det) * -b;
            // const inv_c = (1/det) * -c;
            // const inv_d = (1/det) * a;
            // const k = inv_a*x + inv_b*y;
            // const r = inv_c*x + inv_d*y;
            // if(k <= 1 && k >= 0 && r >= 0) {
            //     // We have a winner
            //     return this.center().add(intersectLine.scale(r))
            // }
        }
        return 0
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