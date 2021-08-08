import { Component } from "../Component.js";
import { Vector } from "../util/Vector.js";

export class Transform extends Component {
    constructor(go) {
        super(go)
        this.position = new Vector()
        this.rotation = 0;
    }
}