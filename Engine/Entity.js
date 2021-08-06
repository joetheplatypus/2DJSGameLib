import { Vector } from "./Vector.js"

// Base object, stores list of components which provide functionality
export class Entity {
    constructor() {
        this.components = [];
        this.position = new Vector();
        this.rotation = 0;
    }
    init() {
        this.components.map(c => c.init())
    }
    update() {
        this.components.map(c => c.update())
    }
    addComponent(component, ...args) {
        const c = new component(this, args)
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
            if(e.components.find(c => c instanceof component)) {
                return c;
            }
            return null;
        }).map(i => i !== null)
    }
}
Entity.list = []