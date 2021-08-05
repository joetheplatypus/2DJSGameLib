export class Item {
    constructor(name, sprite) {
        this.name = name;
        this.sprite = sprite;
        Item.list.push(this);
    }
    static fromName(name) {
        return Item.list.find(i => i.name === name);
    }
}
Item.list = []