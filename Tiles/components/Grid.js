import { Component, Components } from "../../NewEngine/main.js";


export class Grid extends Component {
    constructor(go) {
        super(go);
        this.cells = new util.Expanding2DArray(null);
        this.cellSize = 128;
    }

    get(i,j) {
        return this.cells.get(i,j);
    }

    // Adds entity to grid
    setTile(i, j, entity) {
        const worldPos = this.cellToWorld({ x:i, y:j });
        const transform = entity.getComponent(Components.Transform)
        if(!transform) {
            console.warn('Cannot add entity without transform to grid')
        } else {
            transform.position.set(worldPos.x, worldPos.y)
            this.cells.set(i,j)
        }
        
    }

    // Helpers to convert between cell indexes and world position
    cellToWorld({x,y}) {
        const transform = this.go.getComponent(Components.Transform)
        return {
            x: transform.position.x + x*this.cellSize,
            y: transform.position.y + y*this.cellSize,
        }
    }
    worldToCell({x,y}) {
        return {
            x: Math.round(x/this.cellSize),
            y: Math.round(y/this.cellSize),
        }
    }

    // Snaps an entity to the centre of a grid cell.  Either nearest or specified by cell {x,y}
    snap(ent, cell = null) {
        const transform = ent.getComponent(Components.Transform)
        if(cell != null) {
            const p = this.cellToWorld(cell);
            transform.position.set(p.x, p.y)
        } else {
            const c = this.worldToCell(transform.position);
            const p = this.cellToWorld(c);
            transform.position.set(p.x, p.y)
        }
    }


}