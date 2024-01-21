import Bullet from "./bullet.js";
import { genOscPositions, SOUND_LEVELS } from "../utils.js";

const MOVE_RANGE = 14;
const FPS = 12;
const TIME_PER_FRAME = 1000 / FPS;
const Y_POSITIONS = genOscPositions(MOVE_RANGE);

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

export default class Enemies {
    constructor(scene) {

        this.activeEnemies = [];
        this.fallingEnemies = [];
        this.scene = scene;

        // Movement reference point.
        this.anchor = {
            x: scene.scale.width / 2,
            y: scene.scale.height / 2
        };

        this.countDown = TIME_PER_FRAME;

        this.speed = SPEED_INIT;
        this.direction = DIRECTION.right;
        this.isAttacking = true;

        // Bullets pool
        this.bullets = scene.physics.add.group({ classType: Bullet });
        for (let i = 0; i < BULLETS_POOL_SIZE; i++) {
            this.bullets.add(new Bullet("Bullet-1", BULLET_SPEED, scene));
        }

        // Create enemies
        for (let i = 0; i < ROW_SIZE * COLUMN_SIZE; i++) {
            let enemy = this.scene.physics.add.sprite(0, 0, "atlas", "Enemy-0");

            // Offsets
            enemy.offsetX = Phaser.Math.Between(-this.scene.scale.width, this.scene.scale.width);
            enemy.offsetY = Phaser.Math.Between(-this.scene.scale.height * 3, -this.scene.scale.height);

            // Initial Y_POSITIONS index
            enemy.yPosIdx = Phaser.Math.Between(0, Y_POSITIONS.length - 1);

            // Activate animation
            enemy.play("enemy_idle");

            // Physics configured only to allow collisions
            enemy.enableBody();
            enemy.setDirectControl(true);

            this.activeEnemies.push(enemy);
        }

        this.regroup(ROW_SIZE, COLUMN_SIZE);

    }

    update(delta) {
        this.updatePositions(delta);
        if (this.isAttacking) {
            this.checkBounds();
            this.anchor.x += this.speed * this.direction * delta / 1000;
        }
    }

    updatePositions(delta) {
        // Active Enemies
        let newFrame = false;
        this.countDown -= delta;
        if (this.countDown < 0) {
            this.countDown = TIME_PER_FRAME;
            newFrame = true;
        }
        this.activeEnemies.forEach(enemy => {
            if (newFrame) {
                enemy.yPosIdx = Phaser.Math.Wrap(++enemy.yPosIdx, 0, Y_POSITIONS.length);
            }
            enemy.setY(enemy.offsetY + Y_POSITIONS[enemy.yPosIdx] + this.anchor.y);
            enemy.setX(this.anchor.x + enemy.offsetX);
        });
    }

    checkBounds() {
        const items = this.activeEnemies;
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

    explode(enemy) {
        this.fallingEnemies.push(enemy);
        this.activeEnemies.splice(this.activeEnemies.indexOf(enemy), 1);
        enemy.setDirectControl(false);
        enemy.body.setGravityY(100);
        enemy.body.setAngularVelocity(Phaser.Math.Between(-30, 30));
        enemy.body.setVelocityX(enemy.body.velocity.x / 4);
        enemy.setBodySize(2, 2);
        enemy.setCollideWorldBounds(true, 0, 0, true);
        enemy.play("enemy_explode");
        this.speed += SPEED_STEP;
    }

    regroup(rows, columns) {
        let size = this.activeEnemies.length;
        rows = rows || Math.floor(Math.sqrt(size));
        columns = columns || Math.ceil(Math.sqrt(size));
        columns = rows * columns < size ? columns + 1 : columns;

        this.isAttacking = false;

        this.scene.tweens.add({
            targets: this.anchor,
            x: this.scene.scale.width / 2,
            y: (columns * ITEM_WIDTH + (columns - 1) * ITEM_PADDING) / 2 + GROUP_MARGIN,
            duration: 4000,
            onComplete: () => {
                if (this.scene.player.isAlive) {
                    this.isAttacking = true;
                    this.scene.events.emit("enemies-ready");
                }
            }
        });

        const offsetX0 = - (rows * ITEM_WIDTH + (rows - 1) * ITEM_PADDING) / 2 + ITEM_WIDTH / 2;
        const offsetY0 = - (columns * ITEM_WIDTH + (columns - 1) * ITEM_PADDING) / 2 + GROUP_MARGIN + ITEM_WIDTH / 2;
        let idx = 0;

        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                const newOffsetX = offsetX0 + j * (ITEM_PADDING + ITEM_WIDTH);
                const newOffsetY = offsetY0 + i * (ITEM_PADDING + ITEM_WIDTH);

                const enemy = this.activeEnemies[idx++];

                if (!enemy) break;

                // Column position
                enemy.column = j;

                this.scene.tweens.add({
                    targets: enemy,
                    offsetX: newOffsetX,
                    offsetY: newOffsetY,
                    duration: 3000,
                    ease: "sine.inout"
                });
            }
        }
    }

    shoot() {

        const enemies = this.activeEnemies;

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

        if(!shooter) return;
        
        shooter.chain(["enemy_shoot", "enemy_idle"]);
        shooter.stop();
        let b = this.bullets.getFirst();
        if (b) {
            this.scene.sound.play("enemy_shoot", { volume: SOUND_LEVELS.shoot });
            b.shoot(shooter.x, shooter.y);
        }
    }
}
