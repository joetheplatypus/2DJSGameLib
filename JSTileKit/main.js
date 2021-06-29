import { loadSpritesFromGrid } from '../HTMLRenderKit/main.js'
import { Tile } from './Tile.js';

export * from './Tile.js'
export * from './TileLoader.js'
export * from './TileSheet.js'
export * from './EntityLoader.js'
export * from './Grid.js'


// export function worldToGrid({x,y}) {
//     return {x:Math.round(x/Tile.size), y:Math.round(y/Tile.size)};
// }

// export function gridToWorld({x,y}) {
//     return {x:x*Tile.size, y:y*Tile.size};
// }

// export function snapToGrid(obj) {
//     const t = worldToGrid(obj.position);
//     const p = gridToWorld(t);
//     obj.position.x = p.x;
//     obj.position.y = p.y;
// }

// export function moveToGrid(obj, x, y) {
//     const t = gridToWorld({x,y});
//     obj.position.x = t.x;
//     obj.position.y = t.y;
// }

