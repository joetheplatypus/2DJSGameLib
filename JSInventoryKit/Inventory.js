import EventEmitter from "../JSEngineKit/EventEmitter.js";

export class Inventory {
    constructor() {
        this.itemSlots = [];
        this.onchange = new EventEmitter();
    }
    add(item, amount) {
        if(amount === undefined) {
            amount = 1;
        }
        const slot = this.getSlot(item);
        if(slot) {
            slot[1] += amount;
        } else {
            this.itemSlots.push([item, amount])
        }
        this.onchange.call();
    }
    remove(item, amount) {
        if(amount === undefined) {
            amount = 1;
        }
        const slot = this.getSlot(item);
        if(slot) {
            slot[1] -= amount;
            if(slot[1] <= 0) {
                this.itemSlots = this.itemSlots.filter(_slot => _slot !== slot);
            }
            this.onchange.call();
        }
    }

    // Remove by index in itemSlot array
    removeSlot(index) {
        this.itemSlots.splice(index, 1)
        this.onchange.call();
    }

    // Detects whether inventory has the required items.
    has(item, amount) {
        if(amount === undefined) {
            amount = 1;
        }
        const slot = this.getSlot(item);
        if(slot) {
            return slot[1] >= amount;
        }
        return false;
        
    }
    getSlot(item) {
        return this.itemSlots.find(([_item, amount]) => _item === item);
    }
}