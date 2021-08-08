import { Entity } from "./Entity.js"

export class System {
    constructor() {
        this.req = []
        System.list.push(this)
    }
    update(entities) {

    }
    static updateAll() {
        System.list.map(system => {
            const entities = Entity.allWith(system.req)
            system.update(entities)
        })
    }
}
System.list = []