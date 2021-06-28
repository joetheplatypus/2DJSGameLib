import { Vector } from './Vector.js'
export class Polygon {

    // Collection of points {x,y} in CLOCKWISE direction.
    constructor(...nodes) {
        this.nodes = nodes;
        this.repNodes = [...nodes, nodes[0]]
    }

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

}