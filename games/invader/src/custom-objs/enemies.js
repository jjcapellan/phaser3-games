import Bullet from "./bullet.js";
import Enemy from "./enemy.js";

const ROW_SIZE = 11;         // elements
const COLUMN_SIZE = 4;       // elements
const ITEM_PADDING = 8;      // px
const ITEM_WIDTH = 24;       // width == height (px)
const GROUP_MARGIN = 6;      // px
const SPEED_INIT = 20;       // px / sec
const SPEED_STEP = 5;        // px / sec
const BULLET_SPEED = 200;    // px / sec
const BULLETS_POOL_SIZE = 4; // elements
const DIRECTION = {
    left: -1,
    right: 1
};

export default class Enemies extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        // Movement reference point.
        this.anchor = {
            x: scene.scale.width / 2,
            y: (COLUMN_SIZE * ITEM_WIDTH + (COLUMN_SIZE - 1) * ITEM_PADDING) / 2 + GROUP_MARGIN
        };

        this.speed = SPEED_INIT;
        this.direction = DIRECTION.right;

        // Bullets pool
        const bullets = scene.physics.add.group({ classType: Bullet });
        for (let i = 0; i < BULLETS_POOL_SIZE; i++) {
            bullets.add(new Bullet("Bullet-1", BULLET_SPEED, scene));
        }

        // Explosion effect on the ground
        this.expl = scene.add.particles(0, 0, "atlas", {
            frame: "Smoke-0",
            lifespan: 1000,
            speed: { min: 10, max: 20 },
            scale: { max: 2, min: 0.5 },
            alpha: { start: 1, end: 0 },
            gravityY: 4,
            emitting: false
        });

        // Shoot sound
        const snd_shoot = scene.sound.add("laser2");


        // Add enemies to the group
        const offsetX0 = - (ROW_SIZE * ITEM_WIDTH + (ROW_SIZE - 1) * ITEM_PADDING) / 2 + ITEM_WIDTH / 2;
        const offsetY0 = - (COLUMN_SIZE * ITEM_WIDTH + (COLUMN_SIZE - 1) * ITEM_PADDING) / 2 + GROUP_MARGIN + ITEM_WIDTH / 2;
        for (let i = 0; i < COLUMN_SIZE; i++) {
            for (let j = 0; j < ROW_SIZE; j++) {
                let enemy = new Enemy(
                    scene,
                    offsetX0 + j * (ITEM_PADDING + ITEM_WIDTH),
                    offsetY0 + i * (ITEM_PADDING + ITEM_WIDTH),
                    this.anchor,
                    bullets
                );

                // column will be used to pickup front shooters
                enemy.column = j;

                // Reference to remove itself
                enemy.parentGroup = this;

                // Particle emmiter
                enemy.emitter = this.expl;

                // Shoot sound
                enemy.shootSound = snd_shoot;

                this.add(enemy, true);
            }
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.checkBounds();
        this.anchor.x += this.speed * this.direction * delta / 1000;
    }

    checkBounds() {
        const items = this.getMatching("active", true);
        const freePath = items.every((enemy) => {
            if (enemy.x < GROUP_MARGIN + ITEM_WIDTH / 2) {
                this.direction = DIRECTION.right;
                return false;
            }
            if (enemy.x > this.scene.scale.width - GROUP_MARGIN - ITEM_WIDTH / 2) {
                this.direction = DIRECTION.left;
                return false;
            }
            return true;
        }, this);

        if (!freePath) {
            this.speed += SPEED_STEP;
            const tween = this.scene.tweens.addCounter({
                from: this.anchor.y,
                to: this.anchor.y + ITEM_PADDING,
                duration: 1000,
                onUpdate: () => {
                    this.anchor.y = tween.getValue();
                }
            });
        }
    }

    shoot() {

        const enemies = this.getMatching("active", true);

        // Each element represents one column. 1 == free column, 0 == shooter selected
        const slots = [];
        slots.length = ROW_SIZE;
        slots.fill(1);

        const shooters = [];

        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            const column = enemy.column;
            if (slots[column] == 1) {
                slots[column] = 0;
                shooters.push(enemy);
            }
            if (shooters.length == ROW_SIZE) {
                break;
            }
        } // End for

        // Choose one front shooter 
        const shooter = Phaser.Math.RND.pick(shooters);

        shooter.shoot();
    }
}