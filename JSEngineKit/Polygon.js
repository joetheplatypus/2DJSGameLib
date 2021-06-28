/**
 * Utility class for storing a representation of a polygon in the form of an array of vertices in a CLOCKWISE ordering.
 */
export class Polygon {

    /**
     * Collection of points {x,y} in CLOCKWISE direction.
     * @param  {...any} nodes 
     */
    constructor(...nodes) {
        this.nodes = nodes;
        this.repNodes = [...nodes, nodes[0]]
    }
    tangents() {
        // get tangents
        let tangents = [];
        for(let i = 0; i < this.nodes.length; i++) {
            tangents.push({
                x: this.repNodes[i+1].x - this.repNodes[i].x,
                y: this.repNodes[i+1].y - this.repNodes[i].y,
            })
        }
        // normalise
        return tangents.map(({x,y}) => {
            const r = Math.sqrt(Math.pow(x,2) + Math.pow(y,2))
            return {
                x: x/r,
                y: y/r
            }
        })
    }
    normals() {
        // rotate tangents A/C to get normals
        return this.tangents().map(({x,y}) => {
            return { x: y, y: -x }
        })
    }
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