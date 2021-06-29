import { Tile } from './Tile.js'
import { TileSheet } from './TileSheet.js';
import { to2d } from '../JSEngineKit/main.js'

export function loadTileMap(map, grid, layerName = 'tiles') {

    // Parse Tiled format into tile layers and tilesheets needed.
    const layers = parseTiledFormat(map);
    const sheets = parseTiledSheets(map);

    // Concat sprite/class maps for all tilesheets needed 
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

    // Only load specified layer onto grid
    const tiles = layers.find(l => l.name === layerName).data;

    for(let y = 0; y < tiles.length; y++) {
        for(let x = 0; x < tiles[0].length; x++) {
            if(tiles[y][x] === 0) {
                continue;
            }
            const sprite = spriteMap.get(tiles[y][x])
            const classs = classMap.get(tiles[y][x])
            grid.setTile(y,x,sprite,classs)
            
            // const tx = x*Tile.size;
            // const ty = y*Tile.size;
            // const sprite = spriteMap.get(tiles[y][x])
            // if(sprite) {
            //     const classToInstantiate = classMap.get(tiles[y][x]);
            //     if(classToInstantiate) {
            //         new classToInstantiate(tx, ty, sprite);
            //     } else {
            //         new Tile(tx, ty, sprite);
            //     }
            // }
        }
    }
}

// Return all tilesheets referenced by the Tiled map data
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

// Return Tiled map data as array of tile layers only each with 2d array
function parseTiledFormat(obj) {
    const tile_layers = obj.layers.filter(o => o.type === 'tilelayer')
    return tile_layers.map(o => {
        return {
            name: o.name,
            data: to2d(o.data, obj.width)
        }
    })
}