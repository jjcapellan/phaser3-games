import Player from "../custom-objs/player.js";
import Enemies from "../custom-objs/enemies.js";
import Shields from "../custom-objs/shields.js";

export default class GamePlay extends Phaser.Scene {
    constructor() {
        super("gameplay");
    }

    create() {
        this.anchor = {
            x: CENTER.x,
            y: CENTER.y
        };

        // Global animations
        this.anims.create({ key: "enemy_idle", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy-", end: 4 }), repeat: -1 });
        this.anims.create({ key: "enemy_shoot", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy-", start: 5, end: 8 }) });
        this.anims.create({ key: "enemy_explode", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy-", start: 9, end: 14 }), frameRate: 5 });
        this.anims.create({ key: "player_idle", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", end: 5 }), repeat: -1 });
        this.anims.create({ key: "player_shoot", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", start: 6, end: 9 }) });
        this.anims.create({ key: "player_hit", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", start: 10, end: 12 }), frameRate: 3 });

        // Global sounds
        this.sound.add("player_shoot");
        this.sound.add("enemy_shoot");
        this.sound.add("ground");
        this.sound.add("explode");

        this.add.image(0, 0, "atlas", "Background-0").setOrigin(0).setTint(0x888888);
        this.add.image(0, this.scale.height, "atlas", "Ruins3-0").setOrigin(0, 1).setTint(0x666666);

        // Player smoke effect
        const smoke = this.add.particles(49, this.scale.height - 20, "atlas",
            {
                frame: "Smoke-0",
                lifespan: 3000,
                scale: { start: 0.5, end: 0 },
                alpha: { max: 0.8, min: 0.3 },
                speed: 6,
                angle: { min: -160, max: -84 },
                gravityY: -10,
                emitting: false
            });

        const player = this.add.existing(new Player(this, CENTER.x, this.scale.height - 20));
        this.enemies = new Enemies(this);

        const shieldHit = this.add.particles(0, 0, "atlas", {
            frame: "Particle-yellow",
            lifespan: 600,
            speed: { min: 10, max: 20 },
            scale: { max: 1, min: 0.5 },
            alpha: { start: 1, end: 0 },
            gravityY: 4,
            emitting: false
        });
        this.shields = new Shields(this, player.y - 40);

        // One enemy shoot per second
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.enemies.shoot();
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

        // Crash effect on the ground
        const crash = this.add.particles(0, 0, "atlas", {
            frame: "Smoke-0",
            lifespan: 1000,
            speed: { min: 10, max: 20 },
            scale: { max: 2, min: 0.5 },
            alpha: { start: 1, end: 0 },
            gravityY: 4,
            emitting: false
        });

        this.add.image(0, this.scale.height, "atlas", "Floor-0").setOrigin(0, 1);

        this.physics.world.on("worldbounds", (body, up, down) => {
            if (down) {
                body.enable = false;
                this.sound.play("ground");
                crash.emitParticle(10, body.x, body.y);
                if (body.width == player.width) {
                    smoke.x = player.x;
                    smoke.y = player.y;
                    smoke.emitting = true;
                }
            }
        });

        this.physics.add.collider(player.bullet, this.enemies.activeEnemies, (bullet, enemy) => {
            bullet.reset();
            expl.emitParticle(40, enemy.x, enemy.y);
            this.sound.play("explode");
            this.enemies.explode(enemy);
        });

        this.physics.add.collider(player, [this.enemies.bullets, this.enemies.activeEnemies], () => {
            expl.emitParticle(60, player.x, player.y);
            player.explode();
        });

        this.physics.add.collider(this.shields.activeShields, this.enemies.bullets, (shield, bullet) => {
            bullet.reset();
            shieldHit.setPosition(shield.x, shield.y - shield.height / 2);
            shieldHit.particleAngle = { min: -135, max: -45 };
            shieldHit.emitParticle(10);
            this.shields.hit(shield);
        });

        this.physics.add.collider(player.bullet, this.shields.activeShields, (bullet, shield) => {
            bullet.reset();
            shieldHit.setPosition(shield.x, shield.y + shield.height / 2);
            shieldHit.particleAngle = { min: 135, max: 45 };
            shieldHit.emitParticle(10);
            this.shields.hit(shield);
        });
    }

    update(time, delta) {
        this.enemies.update(delta);
    }
}