import { GameObject, util } from "../Engine/main.js";
import { Tile } from "./Tile.js";

export class Grid extends GameObject {
    constructor() {
        super();
        this.bypassCollisions = true;
        this.cells = new util.Expanding2DArray(null);
        this.cellSize = 128;
    }

    get(i,j) {
        if(this.cells.length-1 < i || this.cells[0].length-1 < j) {
            return null;
        }
        return this.cells.get(j,i);
    }

    // Spawns Tile or custom class and adds to grid
    setTile(i, j, sprite, classs = Tile) {
        const worldPos = this.cellToWorld({ x:i, y:j });
        this.cells.set(j,i,new classs(worldPos.x, worldPos.y, sprite))
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