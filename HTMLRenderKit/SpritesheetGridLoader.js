import { Sprite } from './Sprite.js'

// Utility function to load sprites from a grid based spritesheet using 2D array.  Allows for sheet cropping.
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
            new Sprite(arrayNames[y][x], 
                spritesheetName,
                x*tileWidth + crop.left,
                y*tileHeight + crop.top,
                tileWidth-crop.left-crop.right,
                tileHeight-crop.top-crop.bottom);
        }
    }
}