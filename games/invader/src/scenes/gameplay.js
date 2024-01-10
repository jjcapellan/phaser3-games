import Player from "../custom-objs/player.js";
import Enemies from "../custom-objs/enemies.js";

export default class GamePlay extends Phaser.Scene {
    constructor() {
        super("gameplay");
    }

    create() {
        this.anchor = {
            x: CENTER.x,
            y: CENTER.y
        };

        const explodeSound = this.sound.add("explode2");

        

        this.add.image(0, 0, "atlas", "Background-0").setOrigin(0).setTint(0x888888);
        this.add.image(0, this.scale.height, "atlas", "Ruins3-0").setOrigin(0, 1).setTint(0x666666);
        const player = this.add.existing(new Player(this, CENTER.x, this.scale.height - 20));
        const enemies = this.add.existing(new Enemies(this));
        this.add.image(0, this.scale.height, "atlas", "Floor-0").setOrigin(0, 1);

        // One enemy shoot per second
        this.time.addEvent({ 
            delay: 1000, 
            callback: () => {
                enemies.shoot();
            },
            callbackScope: this,
            loop: true
        });

        // Explosion effect
        const expl = this.add.particles(0, 0, "atlas", {
            frame: "Particle-yellow",
            lifespan: 2000,
            speed: { min: 20, max: 90 },
            scale: { max: 2, min: 0.5 },
            alpha: { start: 1, end: 0 },
            blendMode: "add",
            emitting: false,
            rotate: { max: 359, min: 0 }
        });

        this.physics.add.collider(player.bullet, enemies, (bullet, enemy) => {
            bullet.reset();
            expl.emitParticle(40, enemy.x, enemy.y);
            explodeSound.play();
            enemy.explode();
        });
    }
}