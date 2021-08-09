export const ComponentFactory =  {
    map: new Map([]),
    register(name, component) {
        this.map.set(name, component)
    },
    get(name) {
        return this.map.get(name)
    }
}