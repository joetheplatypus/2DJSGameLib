// Stores reference to spritesheet image by name.
export class Spritesheet {
    constructor(name, path) {
        this.name = name;
        this.path = path;
        this.image = new Image()
        this.image.src = this.path
        Spritesheet.list.push(this)
    }
    static fromName(name) {
        return Spritesheet.list.find(sheet => sheet.name === name)
    }
}
Spritesheet.list = [];