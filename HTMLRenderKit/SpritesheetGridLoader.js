import { Sprite } from './Sprite.js'

export const SpritesheetLoader = {

    // Utility function to load sprites from a grid based spritesheet using 2D array.  Allows for sheet cropping.
    fromGrid(sheetName, gridWidth, gridHeight, spriteNames, crop = {top:0,bottom:0,left:0,right:0}) {
        for(let y = 0; y < spriteNames.length; y++) {
            for(let x = 0; x < spriteNames[0].length; x++) {
                if(spriteNames[y][x] === null) {
                    continue;
                }
                new Sprite(spriteNames[y][x], 
                    sheetName,
                    x*gridWidth + crop.left,
                    y*gridHeight + crop.top,
                    gridWidth - crop.left - crop.right,
                    gridHeight - crop.top - crop.bottom);
            }
        }
    }

}


