import { Component } from "../Component.js";
import { Vector } from "../util/Vector.js";
import { Transform } from "./Transform.js";
import { ComponentFactory } from "../ComponentFactory.js";

export class Physics extends Component {
    constructor(go) {
        super(go)
        this.require = [Transform]
        this.velocity = new Vector()
        this.acceleration = new Vector()
        this.drivingForce = new Vector()
        this.friction = new Vector()
        this.angularVelocity = 0
        this.mass = 1
    }
}
ComponentFactory.register('Physics', Physics)