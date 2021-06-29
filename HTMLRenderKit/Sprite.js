// Stores reference to sprite store in spritesheet by name.
export class Sprite {
    constructor(name, sheet, x, y, w, h) {
        this.name = name;
        this.sheet = sheet;
        this.pos = {x,y};
        this.dim = {w,h};
        Sprite.list.push(this)
    }
    static fromName(name) {
        return Sprite.list.find(sprite => sprite.name === name)
    }
}
Sprite.list = [];