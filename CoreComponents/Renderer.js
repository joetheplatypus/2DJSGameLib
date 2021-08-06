import { Component } from "../Engine/main.js";

export class Renderer extends Component {
    constructor(go, sprite) {
        super(go)
        this.sprite = sprite
    }
    draw(renderer) {
        renderer.draw(this.sprite, this.go.position.x, this.go.position.y, this.go.rotation)
    }
}