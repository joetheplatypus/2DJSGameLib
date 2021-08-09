import { TileSheet } from './TileSheet.js';
import { util } from '../Engine/main.js'

export const TileLoader = {
    fromTiledLayer(map, grid, layerName = 'Tile Layer 1') {
         // Parse Tiled format into tile layers and tilesheets needed.
        const layers = parseTiledFormat(map);
        const tilesheets = parseTiledSheets(map);

        // Concat sprite maps for all tilesheets needed 
        let spriteMap = [];
        let startGIDs = [];
        tilesheets.map(([sheet,start]) => {
            spriteMap = spriteMap.concat(sheet.generateSpriteMapping(start));
            startGIDs.push(start)
        })
        const startGIDsSorted = startGIDs.sort()
        spriteMap = new Map(spriteMap);

        // Only load specified layer onto grid
        const tiles = layers.find(l => l.name === layerName).data;

        for(let y = 0; y < tiles.length; y++) {
            for(let x = 0; x < tiles[0].length; x++) {
                if(tiles[y][x] === 0) {
                    continue;
                }
                // can be refactored with map concat if doing this...
                const gid = tiles[y][x]
                const sprite = spriteMap.get(gid)
                const startGID = Math.max(...startGIDsSorted.filter(s => s < gid))
                const [tilesheet,fgid] = tilesheets[startGIDs.indexOf(startGID)]
                const entity = tilesheet.creation(sprite)
                grid.setTile(x,y,entity)
            }
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

// Return Tiled map data as array of tile layers only, each with 2d array
function parseTiledFormat(obj) {
    const tile_layers = obj.layers.filter(o => o.type === 'tilelayer')
    return tile_layers.map(o => {
        return {
            name: o.name,
            data: util.to2d(o.data, obj.width)
        }
    })
}