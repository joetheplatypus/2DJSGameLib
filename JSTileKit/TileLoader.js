import { Tile } from './Tile.js'
import { TileSheet } from './TileSheet.js';

export function loadTileMap(map) {
    const layers = parseTiledFormat(map);
    const sheets = parseTiledSheets(map);

    let spriteMap = [];
    sheets.map(([sheet,start]) => {
        spriteMap = spriteMap.concat(sheet.generateSpriteMapping(start));
    })
    spriteMap = new Map(spriteMap);

    let classMap = [];
    sheets.map(([sheet,start]) => {
        classMap = classMap.concat(sheet.generateClassMapping(start));
    })
    classMap = new Map(classMap);

    //just take the layer 'tiles'
    const tiles = layers.find(l => l.name === 'tiles').data;
    for(let y = 0; y < tiles.length; y++) {
        for(let x = 0; x < tiles[0].length; x++) {
            if(tiles[y][x] === 0) {
                continue;
            }
            const tx = x*Tile.size;
            const ty = y*Tile.size;
            const sprite = spriteMap.get(tiles[y][x])
            if(sprite) {
                const classToInstantiate = classMap.get(tiles[y][x]);
                if(classToInstantiate) {
                    new classToInstantiate(tx, ty, sprite);
                } else {
                    new Tile(tx, ty, sprite);
                }
            }
        }
    }
}

function parseTiledSheets(obj) {
    const res = obj.tilesets.map(({firstgid, source}) => {
        const name = source.substring(0,source.length-4);
        const tileSheet = TileSheet.fromName(name);
        if(!tileSheet) {
            console.warn('Could not find TileSheet with name ' + name)
            return null;
        }
        return [tileSheet, firstgid];
    })
    return res.filter(r => r !== null);
}

function parseTiledFormat(obj) {
    const tile_layers = obj.layers.filter(o => o.type === 'tilelayer')
    return tile_layers.map(o => {
        return {
            name: o.name,
            data: to2d(o.data, obj.width, obj.height)
        }
    })
}

function to2d(arr, width, height) {
    const res = [];
    for(let i = 0; i < height; i++) {
        const row = [];
        for(let j = 0; j < width; j++) {
            row.push(arr[i*width+j])
        }
        res.push(row);
    }
    return res;
}