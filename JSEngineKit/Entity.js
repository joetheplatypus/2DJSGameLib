import EventEmitter from './EventEmitter.js';
import { GameObject } from './GameObject.js'

export class Entity extends GameObject{
    constructor() {
        super();
        this.maxHealth = 100;
        this.onDeath = new EventEmitter();
        this.onDeath.add(() => this.death());
    }
    init() {
        this.health = this.maxHealth;
    }
    damage(amount) {
        this.health -= amount;
        if(this.health <= 0) {
            this.onDeath.call();
        }
    }
    death() {
        this.remove()
    }
}