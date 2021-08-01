import { GameObject } from '../Engine/GameObject.js'

export class Tile extends GameObject {
    constructor(x, y, w, h,sprite) {
        super()
        this.fixed = true;
        this.sprite = sprite;
        this.position.x = x;
        this.position.y = y;
        this.dimensions.x = w+1;
        this.dimensions.y = h+1;
    }
    draw(renderer) {
        renderer.setLayer(1);
        renderer.draw(this.sprite, this.position.x, this.position.y)
    }
}