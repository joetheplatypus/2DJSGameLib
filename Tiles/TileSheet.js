import { Tile } from "./Tile.js";

// Stores both a class and sprite for each item in the tilesheet.
export class TileSheet {
    constructor(name) {
        this.name = name;
        this.sprites = [[]]; // Sprite to be passed to Tile on creation
        this.creation = (sprite) => {}; // Called to create tile entity
        TileSheet.list.push(this);
    }
    setSprites(sprites) {
        this.sprites = sprites;
    }
    setCreation(creation) {
        this.creation = creation;
    }
    generateSpriteMapping(start = 0) {
        const map = [];
        let inc = start
        for(let i = 0; i < this.sprites.length; i++) {
            for(let j = 0; j < this.sprites[0].length; j++) {
                if(this.sprites[i][j] === null) {
                    inc++;
                    continue;
                }
                map.push([inc, this.sprites[i][j]]);
                inc++;
            }
        }
        return map;
    }

    // Used to search tilemaps from Tiled data
    static fromName(name) {
        return TileSheet.list.find(s => s.name === name);
    }
}
TileSheet.list = [];