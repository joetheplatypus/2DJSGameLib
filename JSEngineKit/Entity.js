import EventEmitter from './EventEmitter.js';
import { GameObject } from './GameObject.js'

export class Entity extends GameObject{
    constructor() {
        super();
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.onDeath = new EventEmitter(); // Useful event to hook
        this.onDeath.add(() => this.death());
    }

    // Deals the specified damage points to the entity's health
    damage(amount) {
        this.health -= amount;
        if(this.health <= 0) {
            this.health = 0;
            this.onDeath.call();
        }
    }

    // Called on death
    death() {
        this.remove();
    }
}