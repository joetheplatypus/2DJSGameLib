import { Component } from "../Component.js";
import { Vector } from "../util/Vector.js";
import { Polygon } from "../util/Polygon.js";
import { AABox } from "../util/AABox.js";
import { Transform } from "./Transform.js";

export class Collider extends Component {
    constructor(go, x, y) {
        super(go)
        this.require = [Transform]
        this.dimensions = new Vector(x,y)
        this.colliderType = Collider.Type.Box
        this.triggerOnly = false
        this.offset = new Vector()
        this.restitution = 0.5
    }
    getPoly() {
        const transform = this.go.getComponent(Transform)
        const pos = transform.position
        const cpd = this.offset
        const c = Math.cos(transform.rotation);
        const s = Math.sin(transform.rotation);
        // local bounds
        const ltl = { x:-this.dimensions.x/2, y:-this.dimensions.y/2 };
        const lbr = { x:this.dimensions.x/2, y:this.dimensions.y/2 };
        const ltr = { x:this.dimensions.x/2, y:-this.dimensions.y/2 };
        const lbl = { x:-this.dimensions.x/2, y:this.dimensions.y/2 };
        // convert to global
        const gtl = { x:c*ltl.x - s*ltl.y + pos.x + cpd.x, y:s*ltl.x + c*ltl.y + pos.y + cpd.y };
        const gbr = { x:c*lbr.x - s*lbr.y + pos.x + cpd.x, y:s*lbr.x + c*lbr.y + pos.y + cpd.y };
        const gtr = { x:c*ltr.x - s*ltr.y + pos.x + cpd.x, y:s*ltr.x + c*ltr.y + pos.y + cpd.y };
        const gbl = { x:c*lbl.x - s*lbl.y + pos.x + cpd.x, y:s*lbl.x + c*lbl.y + pos.y + cpd.y };
        console.log(gtl)
        return new Polygon(gtl, gtr, gbr, gbl);
    }
    getAABox() {
        return AABox.fromPoly(this.getPoly())
    }
}

Collider.Type = {
    // Axis-Aligned Bounding Box
    AABox: 'AABox',
    // Box with rotation
    Box:'Box',
    // Simple circle collider using avg of width and height as diameter
    Circle:'Circle',
}