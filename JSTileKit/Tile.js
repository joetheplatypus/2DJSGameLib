import { GameObject } from '../Engine/GameObject.js'

export class Tile extends GameObject {
    constructor(x, y, sprite) {
        super()
        this.fixed = true;
        this.sprite = sprite;
        this.position.x = x;
        this.position.y = y;
        this.dimensions.x = Tile.size+1;
        this.dimensions.y = Tile.size+1;
        Tile.list.push(this)
    }
    draw(renderer) {
        console.log(this.sprite)
        renderer.setLayer(1);
        renderer.draw(this.sprite, this.position.x, this.position.y)
    }
    static fromName(name) {
        return Tile.list.find(t => t.sprite === name);
    }
}
Tile.size = 128;
Tile.list = [];