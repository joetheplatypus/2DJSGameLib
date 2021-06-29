import { GameObject, grow2d } from "../JSEngineKit/main.js";
import { Tile } from "./Tile.js";

export class Grid extends GameObject {
    constructor() {
        super();
        this.bypassCollisions = true;
        this.cells = [[]];
        this.cellSize = 128;
    }

    get(i,j) {
        if(this.cells.length-1 < i || this.cells[0].length-1 < j) {
            return null;
        }
        return this.cells[i][j];
    }

    // Spawns Tile or custom class and adds to grid
    setTile(i, j, sprite, classs = Tile) {
        grow2d(this.cells, i, j);
        const worldPos = this.cellToWorld({ x:i, y:j });
        this.cells[i][j] = new classs(worldPos.x, worldPos.y, sprite)
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