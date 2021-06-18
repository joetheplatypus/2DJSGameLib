import { Sprite } from './Sprite.js'

export function loadSpritesFromGrid(spritesheetName, tileWidth, tileHeight, arrayNames, crop) {
    if(!crop) {
        crop = {
            top:0,
            bottom:0,
            left:0,
            right:0,
        }
    }
    for(let y = 0; y < arrayNames.length; y++) {
        for(let x = 0; x < arrayNames[0].length; x++) {
            if(arrayNames[y][x] === null) {
                continue;
            }
            // console.log(arrayNames[y][x])
            new Sprite(arrayNames[y][x], spritesheetName, x*tileWidth + crop.left, y*tileHeight + crop.top, tileWidth-crop.left-crop.right, tileHeight-crop.top-crop.bottom)
        }
    }
}