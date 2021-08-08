import { GameObject, util } from "../Engine/main.js";
import { Components } from "../NewEngine/main.js";
import { Tile } from "./Tile.js";

export class Grid extends GameObject {
    constructor() {
        super();
        this.bypassCollisions = true;
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
        return {
            x: this.position.x + x*this.cellSize,
            y: this.position.y + y*this.cellSize,
        }
    }
    worldToCell({x,y}) {
        return {
            x: Math.round(x/this.cellSize),
            y: Math.round(y/this.cellSize),
        }
    }

    // Snaps a GameObject to the centre of a grid cell.  Either nearest or specified by cell {x,y}
    snap(obj, cell = null) {
        if(cell != null) {
            const p = this.cellToWorld(cell);
            obj.position.x = p.x;
            obj.position.y = p.y; 
        } else {
            const c = this.worldToCell(obj.position);
            const p = this.cellToWorld(c);
            obj.position.x = p.x;
            obj.position.y = p.y; 
        }
    }


}