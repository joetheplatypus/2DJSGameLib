class DOM {
    constructor() {
        this.projection = (({x,y}) => {return {x:x,y:y}});
    }
    set(dom) {
        this.dom = dom;
    }
    add(el) {
        this.dom.appendChild(el);
    }
    remove(el) {
        this.dom.removeChild(el)
    }
    setProjection(proj) {
        this.projection = proj;
    }
    project({x,y}) {
        return this.projection({x:x,y:y});
    }
}
export default new DOM();