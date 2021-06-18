import { Tile } from "./Tile.js";

export class TileSheet {
    constructor(name) {
        this.name = name;
        this.sprites = [[]];
        this.classes = [[]];
        TileSheet.list.push(this);
    }
    setSprites(sprites) {
        this.sprites = sprites;
    }
    setClasses(classes) {
        this.classes = classes;
    }
    generateClassMapping(start) {
        const map = [];
        let inc = start
        for(let i = 0; i < this.classes.length; i++) {
            for(let j = 0; j < this.classes[0].length; j++) {
                if(this.sprites[i][j] === null) {
                    inc++;
                    continue;
                }
                if(this.classes[i][j] === null) {
                    this.classes[i][j] = Tile
                }
                map.push([inc, this.classes[i][j]]);
                inc++;
            }
        }
        return map;
    }
    generateSpriteMapping(start) {
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
    static fromName(name) {
        return TileSheet.list.find(s => s.name === name);
    }
}
TileSheet.list = [];