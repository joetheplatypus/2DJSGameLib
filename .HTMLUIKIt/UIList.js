class UIList {
    constructor() {
        this.list = []
    }
    add(item) {
        this.list.push(item)
    }
    remove(item) {
        this.list.splice(this.list.indexOf(item), 1)
    }
    updateAll() {
        this.list.map(item => item.update())
    }
}
export default new UIList()