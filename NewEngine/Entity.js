export class Entity {
    constructor() {
        this.components = []
        Entity.list.push(this)
    }
    addComponent(comp, ...args) {
        const c = new comp(this, ...args)
        for(let i = 0; i < c.require.length; i++) {
            if(this.getComponent(c.require[i]) == null) {
                return false
            }
        }
        this.components.push(c)
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