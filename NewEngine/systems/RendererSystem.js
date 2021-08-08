import { SpriteRenderer } from "../components/SpriteRenderer.js";
import { Transform } from "../components/Transform.js";
import { System } from "../System.js";

export class RendererSystem extends System {
    constructor(renderer) {
        super()
        this.req = [SpriteRenderer]
        this.renderer = renderer
    }
    update(entities) {
        this.renderer.clear()
        entities.map(ent => {
            const sprite = ent.getComponent(SpriteRenderer).sprite
            const transform = ent.getComponent(Transform)
            this.renderer.draw(sprite, transform.position.x, transform.position.y, transform.rotation)
        })
        this.renderer.render()
    }
}