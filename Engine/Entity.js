import { Vector } from "./Vector.js"

// Base object, stores list of components which provide functionality
export class Entity {
    constructor() {
        this.components = [];
        this.position = new Vector();
        this.rotation = 0;
        Entity.list.push(this)
    }
    init() {
        this.components.map(c => c.init())
    }
    update() {
        this.components.map(c => c.update())
    }
    addComponent(component, ...args) {
        const c = new component(this, ...args)
        this.components.push(c)
        return c
    }
    getComponent(componentType) {
        return this.components.find(c => c instanceof componentType)
    }
    static updateAll() {
        Entity.list.map(e => e.update())
    }
    static allWith(component) {
        return Entity.list.filter(e => {
            if(e.components.find(c => c instanceof component)) {
                return true;
            }
            return false;
        })
    }
    static allOf(component) {
        return Entity.list.map(e => {
            return e.components.find(c => c instanceof component)
        }).filter(i => i !== null)
    }
    static partition(size, hasComponent = null) {
        let list = Entity.list
        if(hasComponent) {
            list = Entity.allWith(hasComponent)
        }
        // Need to shift for 0-indexing to account for negative positions
        const shiftX = -Math.min(...GameObject.list.map(g => g.getAABoundingBox().tl.x),0) + size;
        const shiftY = -Math.min(...GameObject.list.map(g => g.getAABoundingBox().tl.y),0) + size;
        // Put into a 2D array
        const partitions = new util.Expanding2DArray([]);
        list.map(collider => {
            const aabox = collider.getAABoundingBox()
            const top = Math.floor((aabox.tl.y + shiftY) / size);
            const bottom = Math.floor((aabox.br.y + shiftY) / size);
            const left = Math.floor((aabox.tl.x + shiftX) / size);
            const right = Math.floor((aabox.br.x + shiftX) / size);
            for(let i=left; i<=right; i++) {
                for(let j=top; j<=bottom; j++) {
                    const arr = partitions.get(i,j)
                    if(arr.length === 0) {
                        partitions.set(i,j,[collider])
                    } else {
                        arr.push(collider)
                    }
                }
            }
        })
        return partitions.toArray()
    }
}
Entity.list = []