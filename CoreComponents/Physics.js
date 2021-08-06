import { Component, Vector } from "../Engine/main.js";

export class Physics extends Component {
    constructor(go) {
        super(go)
        this.fixed = false;
        this.velocity = new Vector();
        this.acceleration = new Vector();
        this.drivingForce = new Vector();
        this.friction = new Vector();
        this.angularVelocity = 0;
        this._apply_impulse = null;
    }
    init() {

    }
    update() {
        if(!this.fixed) {
            this.drivingForce.y += Physics.gravity;
        }

        // Kinematics
        this.acceleration.x = this.drivingForce.x - this.velocity.x*this.friction.x;
        this.acceleration.y = this.drivingForce.y - this.velocity.y*this.friction.y;
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        // Smoothing
        if(this.velocity.x < 0.1 && this.velocity.x > -0.1) {
            this.velocity.x = 0;
        }
        if(this.velocity.y < 0.1 && this.velocity.y > -0.1) {
            this.velocity.y = 0;
        }

        this.go.position.x += this.velocity.x;
        this.go.position.y += this.velocity.y;
        this.go.rotation += this.angularVelocity;

        if(!this.fixed) {
            // Object does not need to be aware of gravity so apply and remove every update
            this.drivingForce.y -= Physics.gravity
        }

        if(this._apply_impulse) {
            this.drivingForce.set(this._apply_impulse.x, this._apply_impulse.y)
            this._apply_impulse = null;
        }
    }
}
Physics.gravity = 0;