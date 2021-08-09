import { Component } from "../Component.js";
import { Transform } from "./Transform.js";
import { ComponentFactory } from "../ComponentFactory.js";

export class SpriteRenderer extends Component {
    constructor(go, sprite) {
        super(go)
        this.require = [Transform]
        this.sprite = sprite
    }
}
ComponentFactory.register('SpriteRenderer', SpriteRenderer)