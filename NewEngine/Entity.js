export class Entity {
    constructor(id) {
        if(id) {
            this.id = id
        } else {
            this.id = Math.random()
        }
        this.components = []
        Entity.list.push(this)
    }
    addComponent(comp, ...args) {
        const c = new comp(this, ...args)
        for(let i = 0; i < c.require.length; i++) {
            if(this.getComponent(c.require[i]) == null) {
                console.warn('Component missing requirements')
                return false
            }
        }
        this.components.push(c)
        return c
    }
    getComponent(comp) {
        return this.components.find(c => c instanceof comp)
    }
    static allWith(comps) {
        return Entity.list.filter(e => {
            for(let i = 0; i < comps.length; i++) {
                if(e.getComponent(comps[i]) == null) {
                    return false
                }
            }
            return true
        })
    }
}
Entity.list = []