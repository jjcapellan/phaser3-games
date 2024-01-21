(() => {
  // games/invader/src/scenes/load.js
  var Load = class extends Phaser.Scene {
    constructor() {
      super("load");
    }
    preload() {
      this.text_loading = this.add.text(CENTER.x, CENTER.y, "Loading ...", { fontSize: 32, color: COLORS.foreground }).setOrigin(0.5);
      this.load.on("complete", function() {
        this.createFont();
        this.createAnimations();
        this.scene.start("menu");
      }, this);
      this.load.atlas("atlas", "/assets/imgs/invader.png", "/assets/imgs/invader.json");
      this.load.audio("menu-background", "/assets/sounds/loop_space_ambience_128.mp3");
      this.load.audio("player_shoot", "/assets/sounds/laser1.ogg");
      this.load.audio("enemy_shoot", "/assets/sounds/laser2.ogg");
      this.load.audio("explode", "/assets/sounds/expl_22050.ogg");
      this.load.audio("ground", "/assets/sounds/ground.ogg");
      this.load.audio("shield_hit1", "/assets/sounds/metal_crash1_22050.ogg");
      this.load.audio("shield_hit2", "/assets/sounds/metal_crash2_22050.ogg");
      this.load.audio("shield_hit3", "/assets/sounds/metal_crash3_22050.ogg");
      this.load.audio("gameover", "/assets/sounds/gameover1.ogg");
      this.load.on("progress", this.updateText, this);
    }
    // End preload()
    createFont() {
      const config = {
        image: "atlas",
        width: 7,
        height: 10,
        chars: "0123456789abcdefghijklmnopqrstuvwxyz?!.,+-*%:= ",
        charsPerRow: 10,
        offset: { x: 0, y: 831 },
        spacing: { x: 1, y: 1 }
      };
      this.cache.bitmapFont.add("pixelfont", Phaser.GameObjects.RetroFont.Parse(this, config));
    }
    // End createFont()
    createAnimations() {
      this.anims.create({ key: "enemy-falling", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy_spin-", end: 3 }), frameRate: 4, repeat: -1 });
      this.anims.create({ key: "enemy_idle", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy-", end: 4 }), repeat: -1 });
      this.anims.create({ key: "enemy_shoot", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy-", start: 5, end: 8 }) });
      this.anims.create({ key: "enemy_explode", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy-", start: 9, end: 14 }), frameRate: 5 });
      this.anims.create({ key: "player_idle", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", end: 5 }), repeat: -1 });
      this.anims.create({ key: "player_shoot", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", start: 6, end: 9 }) });
      this.anims.create({ key: "player_hit", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", start: 10, end: 12 }), frameRate: 3 });
    }
    updateText(progress) {
      this.text_loading.text = `Loading ... ${Math.round(progress * 100)}%`;
    }
    // End updateText
  };

  // node_modules/.pnpm/phaser3-scrollinglayer@3.0.1/node_modules/phaser3-scrollinglayer/dist/scrollinglayer.esm.js
  var Layer = class {
    /**
     * Creates an instance of Layer
     * @param data LayerData object to be managed
     */
    constructor(data) {
      this.data = data;
    }
    /**
     * Sets the opacity.
     * @param alpha Number between 0 (transparent) and 1 (opaque) 
     * @returns Instance of the layer
     */
    setAlpha(alpha) {
      alpha = Math.max(0, alpha);
      this.data.img1.setAlpha(alpha);
      this.data.img2.setAlpha(alpha);
      return this;
    }
    /**
     * Sets the current frame used by the layer.
     * @param frame The frame must be part of the Texture the parent LayerFactory is using.
     * @returns Instance of the layer
     */
    setFrame(frame) {
      this.data.img1.setFrame(frame);
      this.data.img2.setFrame(frame);
      return this;
    }
    /**
     * Sets the origin of the cross axis (y axis for horizontal layer and x axis for vertical layer).
     * @param origin Number between 0 (left/top) and 1 (right/bottom)
     * @returns Instance of the layer
     */
    setOrigin(origin) {
      this.data.origin = Phaser.Math.Clamp(origin, 0, 1);
      this.setPosition(this.data.position);
      return this;
    }
    /**
     * 
     * @param position position in pixels the cross axis (y axis for horizontal layer 
     * and x axis for vertical layer)
     * @returns Instance of the layer
     */
    setPosition(position) {
      this.data.position = position;
      if (this.data.isH) {
        let y = position - this.data.origin * this.data.height;
        this.data.img1.y = this.data.img2.y = y;
        return this;
      }
      let x = position - this.data.origin * this.data.width;
      this.data.img1.x = this.data.img2.x = x;
      return this;
    }
    /**
     * Sets the overlap. Some times is necessary for avoid spaces between images.(default=1)
     * @param overlap Overlap in pixels between the two images
     * @returns Instance of the layer
     */
    setOverlap(overlap) {
      const d = this.data;
      const img1 = d.img1;
      const img2 = d.img2;
      d.overlap = Math.max(0, overlap);
      if (d.isH) {
        if (img1.x < img2.x) {
          img2.x = img1.x + d.width - d.overlap;
          return this;
        }
        img2.x = img1.x - d.width + d.overlap;
        return this;
      }
      if (img1.y < img2.y) {
        img2.y = img1.y + d.height - d.overlap;
        return this;
      }
      img2.y = img1.y - d.height + d.overlap;
      return this;
    }
    /**
     * Sets the speed.
     * @param speed Speed in pixels/second 
     * @returns Instance of the layer
     */
    setSpeed(speed) {
      this.data.speed = speed;
      return this;
    }
    /**
     * Sets the visibility. 
     * @param visible False -> this object is not rendered.
     * @returns Instance of the layer
     */
    setVisible(visible) {
      this.data.img1.setVisible(visible);
      this.data.img2.setVisible(visible);
      return this;
    }
  };
  var LayerFactory = class extends Phaser.GameObjects.Blitter {
    constructor(scene, texture) {
      super(scene);
      this._hLayers = [];
      this._vLayers = [];
      this._handlers = [];
      this.VERSION = "3.0.0";
      this.setTexture(texture);
      this.x = 0;
      this.y = 0;
    }
    /**
     * Creates a new horizontal layer.
     * @param y     y position in pixels
     * @param speed Velocity in pixels/second for x axis
     * @param frame Frame to be rendered. Frame width must be at least viewport width.
     * @returns     Instance of the new layer
     */
    addHlayer(y, speed, frame) {
      let width = this.scene.textures.getFrame(this.texture.key, frame).width;
      let height = this.scene.textures.getFrame(this.texture.key, frame).height;
      let overlap = 1;
      let x1 = 0;
      let x2 = speed < 0 ? width - overlap : -width + overlap;
      let img1 = this.create(x1, y, frame);
      let img2 = this.create(x2, y, frame);
      let data = {
        isH: true,
        speed,
        position: y,
        img1,
        img2,
        width,
        height,
        overlap,
        origin: 0
      };
      this._hLayers.push(data);
      let layer = new Layer(data);
      this._handlers.push(layer);
      return layer;
    }
    /**
     * 
     * @param x     x position in pixels
     * @param speed Velocity in pixels/second for y axis
     * @param frame Frame to be rendered. Frame height must be at least viewport height.
     * @returns     Instance of the new layer
     */
    addVlayer(x, speed, frame) {
      let width = this.scene.textures.getFrame(this.texture.key, frame).width;
      let height = this.scene.textures.getFrame(this.texture.key, frame).height;
      let overlap = 1;
      let y1 = 0;
      let y2 = speed < 0 ? height - overlap : -height + overlap;
      let img1 = this.create(x, y1, frame);
      let img2 = this.create(x, y2, frame);
      let data = {
        isH: false,
        speed,
        position: x,
        img1,
        img2,
        width,
        height,
        overlap,
        origin: 0
      };
      this._vLayers.push(data);
      let layer = new Layer(data);
      this._handlers.push(layer);
      return layer;
    }
    preUpdate(time, delta) {
      this._hLayers.forEach(
        (data) => {
          const distance = getDistance(data.speed, delta);
          data.img1.x += distance;
          data.img2.x += distance;
          if (data.speed < 0 && data.img1.x < -data.width) {
            data.img1.x = data.width + data.img2.x - data.overlap;
            return;
          }
          if (data.speed < 0 && data.img2.x < -data.width) {
            data.img2.x = data.width + data.img1.x - data.overlap;
            return;
          }
          if (data.speed > 0 && data.img1.x > data.width) {
            data.img1.x = -data.width + data.img2.x + data.overlap;
            return;
          }
          if (data.speed > 0 && data.img2.x > data.width) {
            data.img2.x = -data.width + data.img1.x + data.overlap;
            return;
          }
        }
      );
      this._vLayers.forEach(
        (data) => {
          const distance = getDistance(data.speed, delta);
          data.img1.y += distance;
          data.img2.y += distance;
          if (data.speed < 0 && data.img1.y < -data.height) {
            data.img1.y = data.height + data.img2.y - data.overlap;
            return;
          }
          if (data.speed < 0 && data.img2.y < -data.height) {
            data.img2.y = data.height + data.img1.y - data.overlap;
            return;
          }
          if (data.speed > 0 && data.img1.y > data.height) {
            data.img1.y = -data.height + data.img2.y + data.overlap;
            return;
          }
          if (data.speed > 0 && data.img2.y > data.height) {
            data.img2.y = -data.height + data.img1.y + data.overlap;
            return;
          }
        }
      );
    }
    // End preUpdate()
    /**
     * Removes a layer.
     * @param layer Layer to be removed
     */
    removeLayer(layer) {
      layer.data.img1.destroy();
      layer.data.img2.destroy();
      let dataSrc = layer.data.isH ? this._hLayers : this._vLayers;
      dataSrc.splice(dataSrc.indexOf(layer.data), 1);
      this._handlers.splice(this._handlers.indexOf(layer));
    }
    /**
     * Deletes all references to associated data and calls super.destroy().
     * @param fromScene True if this Game Object is being destroyed by the Scene, false if not.
     */
    destroy(fromScene) {
      this._handlers = null;
      this._hLayers = null;
      this._vLayers = null;
      super.destroy(fromScene);
    }
  };
  function getDistance(speed, deltaTime) {
    return deltaTime * speed / 1e3;
  }
  if (false) {
    new EventSource("/esbuild").addEventListener("change", () => location.reload());
  }
  var src_default = LayerFactory;
  if (false) {
    window.LayerFactory = LayerFactory;
  }

  // games/invader/src/scenes/menu.js
  var Menu = class extends Phaser.Scene {
    constructor() {
      super("menu");
    }
    create() {
      this.cameras.main.fadeIn(1e3);
      const snd_background = this.sound.add("menu-background", { loop: true });
      snd_background.play();
      this.add.image(0, 0, "atlas", "Background-0").setOrigin(0);
      this.ships = [];
      this.addShip(-50, -10, "Enemy_spin-0");
      this.addShip(-200, -300, "Enemy_spin-0");
      this.addShip(-500, -550, "Enemy_spin-0");
      this.explode = this.add.particles(0, 0, "atlas", {
        frame: "Particle-blue",
        lifespan: 8e3,
        speed: { min: 2, max: 15 },
        scale: { max: 2, min: 0.5 },
        alpha: { start: 1, end: 0 },
        gravityY: 5,
        emitting: false,
        rotate: { max: 359, min: 0 }
      });
      this.time.addEvent({ delay: 1e3 * 10, callback: this.explodeShip, callbackScope: this, loop: true });
      this.add.image(0, this.scale.height, "atlas", "Ruins3-0").setOrigin(0, 1);
      this.add.image(0, this.scale.height, "atlas", "Ruins2-0").setOrigin(0, 1);
      this.add.particles(
        49,
        this.scale.height - 20,
        "atlas",
        {
          frame: "Smoke-0",
          lifespan: 3e3,
          scale: { start: 0.5, end: 0 },
          alpha: { max: 0.8, min: 0.3 },
          speed: 6,
          angle: { min: -100, max: -84 },
          gravityY: -10
        }
      );
      this.add.existing(new src_default(this, "atlas")).addHlayer(this.scale.height - 30, -10, "Fog-0").setOverlap(0);
      this.add.image(0, this.scale.height, "atlas", "Ruins1-0").setOrigin(0, 1);
      this.add.bitmapText(CENTER.x, CENTER.y / 3 + 40, "pixelfont", "invader").setScale(8).setTint(1711148).setOrigin(0.5);
      this.add.bitmapText(CENTER.x, CENTER.y / 3 + 40 * 2, "pixelfont", "click to play").setOrigin(0.5);
      this.input.once("pointerdown", () => {
        snd_background.stop();
        this.cameras.main.fadeOut(1e3);
        this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("gameplay"));
      });
    }
    addShip(x, y, texture) {
      let ship = this.add.sprite(x, y, "atlas", texture);
      ship.setScale(0.5);
      ship.setAngle(-45);
      ship.speed = 0.1;
      ship.playAfterDelay("enemy-falling", Phaser.Math.Between(100, 1e3));
      this.ships.push(ship);
    }
    explodeShip() {
      let ship = null;
      for (let i = 0; i < this.ships.length; i++) {
        if (this.ships[i].y > 180) {
          ship = this.ships[i];
          break;
        }
      }
      if (!ship || !ship.visible)
        return;
      this.explode.setPosition(ship.x, ship.y);
      this.explode.emitParticle(40);
      ship.setVisible(false);
    }
    resetShip(ship) {
      let x = Phaser.Math.Between(-100, 480);
      let y = -40;
      ship.setVisible(true);
      ship.setPosition(x, y);
    }
    update() {
      this.ships.forEach((ship) => {
        ship.y += ship.speed;
        ship.x += ship.speed;
        if (ship.y > this.scale.height) {
          this.resetShip(ship);
        }
      });
    }
  };

  // games/invader/src/custom-objs/bullet.js
  var Bullet = class extends Phaser.Physics.Arcade.Image {
    constructor(frame, speed, scene) {
      super(scene, -1e3, -1e3, "atlas", frame);
      this.scene.physics.add.existing(this);
      this.enableBody();
      this.speed = speed;
      this.active = false;
      this.addToUpdateList();
      this.addToDisplayList();
    }
    preUpdate(time, delta) {
      if (this.y > this.scene.scale.height || this.y < 0) {
        this.reset();
      }
    }
    reset() {
      this.body.reset(-1e3, 1);
      this.setActive(false);
      this.setVisible(false);
    }
    shoot(x, y) {
      this.body.reset(x, y);
      this.setActive(true);
      this.setVisible(true);
      this.setVelocityY(this.speed);
    }
  };

  // games/invader/src/utils.js
  var SOUND_LEVELS = {
    explode: 0.9,
    shoot: 0.2,
    crash: 0.6,
    metal: 0.2
  };
  var ANIM_POSITIONS_OSC = [
    -1,
    -0.9,
    -0.7,
    -0.4,
    0,
    0.4,
    0.7,
    0.9,
    1,
    0.9,
    0.7,
    0.4,
    0,
    -0.4,
    -0.7,
    -0.9
  ];
  function genOscPositions(range) {
    range = Math.floor(range / 2);
    return ANIM_POSITIONS_OSC.map((position) => range * position);
  }

  // games/invader/src/custom-objs/player.js
  var PLAYER_SPEED = 120;
  var BULLET_SPEED = 250;
  var Player = class extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, "atlas", "Player-0");
      this.isAlive = true;
      this.play("player_idle");
      this.scene.physics.add.existing(this);
      this.enableBody();
      this.setCollideWorldBounds(true);
      this.bullet = scene.add.existing(new Bullet("Bullet-0", -BULLET_SPEED, scene));
      this.leftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.rightKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.shootKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    preUpdate(time, delta) {
      super.preUpdate(time, delta);
      if (!this.isAlive)
        return;
      if (Phaser.Input.Keyboard.JustDown(this.shootKey) && !this.bullet.active) {
        this.chain(["player_shoot", "player_idle"]);
        this.stop();
        this.scene.sound.play("player_shoot", { volume: SOUND_LEVELS.shoot });
        this.bullet.shoot(this.x, this.y);
        this.scene.events.emit("player-shoot");
      }
      if (this.leftKey.isDown) {
        this.setVelocityX(-PLAYER_SPEED);
        return;
      }
      if (this.rightKey.isDown) {
        this.setVelocityX(PLAYER_SPEED);
        return;
      }
      this.setVelocityX(0);
    }
    explode() {
      this.setDirectControl(false);
      this.body.setGravityY(100);
      this.body.setAngularVelocity(Phaser.Math.Between(-30, 30));
      this.setCollideWorldBounds(true, 0, 0, true);
      this.play("player_hit");
      this.isAlive = false;
    }
  };

  // games/invader/src/custom-objs/enemies.js
  var MOVE_RANGE = 14;
  var FPS = 12;
  var TIME_PER_FRAME = 1e3 / FPS;
  var Y_POSITIONS = genOscPositions(MOVE_RANGE);
  var ROW_SIZE = 11;
  var COLUMN_SIZE = 4;
  var ITEM_PADDING = 8;
  var ITEM_WIDTH = 24;
  var GROUP_MARGIN = 6;
  var SPEED_INIT = 20;
  var SPEED_STEP = 5;
  var BULLET_SPEED2 = 200;
  var BULLETS_POOL_SIZE = 4;
  var DIRECTION = {
    left: -1,
    right: 1
  };
  var Enemies = class {
    constructor(scene) {
      this.activeEnemies = [];
      this.fallingEnemies = [];
      this.scene = scene;
      this.anchor = {
        x: scene.scale.width / 2,
        y: scene.scale.height / 2
      };
      this.countDown = TIME_PER_FRAME;
      this.speed = SPEED_INIT;
      this.direction = DIRECTION.right;
      this.isAttacking = true;
      this.bullets = scene.physics.add.group({ classType: Bullet });
      for (let i = 0; i < BULLETS_POOL_SIZE; i++) {
        this.bullets.add(new Bullet("Bullet-1", BULLET_SPEED2, scene));
      }
      for (let i = 0; i < ROW_SIZE * COLUMN_SIZE; i++) {
        let enemy = this.scene.physics.add.sprite(0, 0, "atlas", "Enemy-0");
        enemy.offsetX = Phaser.Math.Between(-this.scene.scale.width, this.scene.scale.width);
        enemy.offsetY = Phaser.Math.Between(-this.scene.scale.height * 3, -this.scene.scale.height);
        enemy.yPosIdx = Phaser.Math.Between(0, Y_POSITIONS.length - 1);
        enemy.play("enemy_idle");
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
        this.anchor.x += this.speed * this.direction * delta / 1e3;
      }
    }
    updatePositions(delta) {
      let newFrame = false;
      this.countDown -= delta;
      if (this.countDown < 0) {
        this.countDown = TIME_PER_FRAME;
        newFrame = true;
      }
      this.activeEnemies.forEach((enemy) => {
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
          duration: 1e3,
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
        duration: 4e3,
        onComplete: () => {
          if (this.scene.player.isAlive) {
            this.isAttacking = true;
            this.scene.events.emit("enemies-ready");
          }
        }
      });
      const offsetX0 = -(rows * ITEM_WIDTH + (rows - 1) * ITEM_PADDING) / 2 + ITEM_WIDTH / 2;
      const offsetY0 = -(columns * ITEM_WIDTH + (columns - 1) * ITEM_PADDING) / 2 + GROUP_MARGIN + ITEM_WIDTH / 2;
      let idx = 0;
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const newOffsetX = offsetX0 + j * (ITEM_PADDING + ITEM_WIDTH);
          const newOffsetY = offsetY0 + i * (ITEM_PADDING + ITEM_WIDTH);
          const enemy = this.activeEnemies[idx++];
          if (!enemy)
            break;
          enemy.column = j;
          this.scene.tweens.add({
            targets: enemy,
            offsetX: newOffsetX,
            offsetY: newOffsetY,
            duration: 3e3,
            ease: "sine.inout"
          });
        }
      }
    }
    shoot() {
      const enemies = this.activeEnemies;
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
      }
      const shooter = Phaser.Math.RND.pick(shooters);
      shooter.chain(["enemy_shoot", "enemy_idle"]);
      shooter.stop();
      let b = this.bullets.getFirst();
      if (b) {
        this.scene.sound.play("enemy_shoot", { volume: SOUND_LEVELS.shoot });
        b.shoot(shooter.x, shooter.y);
      }
    }
  };

  // games/invader/src/custom-objs/shields.js
  var FRAMES = ["Shield-2", "Shield-1", "Shield-0"];
  var SND_HITS = ["shield_hit1", "shield_hit2", "shield_hit3"];
  var GROUPS = 8;
  var GROUP_SIZE = 4;
  var Shields = class {
    constructor(scene, y) {
      this.activeShields = [];
      this.scene = scene;
      const SHIELD_WIDTH = scene.textures.getFrame("atlas", "Shield-0").width;
      const GROUP_WIDTH = GROUP_SIZE * SHIELD_WIDTH;
      const FREE_SPACE = scene.scale.width - GROUPS * GROUP_WIDTH;
      const GROUP_PADDING = FREE_SPACE / (GROUPS + 1);
      for (let i = 0; i < GROUPS; i++) {
        let x = GROUP_PADDING + i * (GROUP_WIDTH + GROUP_PADDING);
        for (let j = 0; j < GROUP_SIZE; j++) {
          let shield = scene.physics.add.staticImage(x + j * SHIELD_WIDTH, y, "atlas", "Shield-0");
          shield.energy = 2;
          this.activeShields.push(shield);
        }
      }
    }
    hit(shield) {
      this.scene.sound.play(SND_HITS[Phaser.Math.Between(0, 2)], { volume: SOUND_LEVELS.metal });
      shield.energy--;
      if (shield.energy < 0) {
        this.activeShields.splice(this.activeShields.indexOf(shield), 1);
        shield.setActive(false);
        shield.setVisible(false);
        return;
      }
      shield.setFrame(FRAMES[shield.energy]);
    }
  };

  // games/invader/src/scenes/gameplay.js
  var PRT_CONFIG_SHIELD = {
    frame: "Particle-yellow",
    lifespan: 600,
    speed: { min: 10, max: 20 },
    scale: { max: 1, min: 0.5 },
    alpha: { start: 1, end: 0 },
    gravityY: 4,
    emitting: false
  };
  var PRT_CONFIG_SMOKE = {
    frame: "Smoke-0",
    lifespan: 3e3,
    scale: { start: 0.5, end: 0 },
    alpha: { max: 0.8, min: 0.3 },
    speed: 6,
    angle: { min: -160, max: -84 },
    gravityY: -10,
    emitting: false
  };
  var PRT_CONFIG_EXPLOSION = {
    frame: "Particle-yellow",
    lifespan: 2e3,
    speed: { min: 20, max: 90 },
    scale: { max: 2, min: 0.5 },
    alpha: { start: 1, end: 0 },
    blendMode: "add",
    emitting: false,
    rotate: { max: 359, min: 0 }
  };
  var PRT_CONFIG_CRASH = {
    frame: "Smoke-0",
    lifespan: 1e3,
    speed: { min: 10, max: 20 },
    scale: { max: 2, min: 0.5 },
    alpha: { start: 1, end: 0 },
    gravityY: 4,
    emitting: false
  };
  var HIT_SCORE = 200;
  var GamePlay = class extends Phaser.Scene {
    constructor() {
      super("gameplay");
    }
    init() {
      this.score = 0;
      this.totalShoots = 0;
      this.hits = 0;
      this.best = 0;
      this.accuracy = 0;
    }
    create() {
      this.cameras.main.fadeIn(1e3);
      const best = window.localStorage.getItem("best");
      if (best == null) {
        window.localStorage.setItem("best", "0");
      } else {
        this.best = best;
      }
      this.add.image(0, 0, "atlas", "Background-0").setOrigin(0).setTint(8947848);
      this.add.image(0, this.scale.height, "atlas", "Ruins3-0").setOrigin(0, 1).setTint(6710886);
      this.prtSmoke = this.add.particles(49, this.scale.height - 20, "atlas", PRT_CONFIG_SMOKE);
      this.player = this.add.existing(new Player(this, CENTER.x, this.scale.height - 20));
      this.enemies = new Enemies(this);
      this.prtShieldHit = this.add.particles(0, 0, "atlas", PRT_CONFIG_SHIELD);
      this.shields = new Shields(this, this.player.y - 40);
      this.prtExplosion = this.add.particles(0, 0, "atlas", PRT_CONFIG_EXPLOSION);
      this.prtCrash = this.add.particles(0, 0, "atlas", PRT_CONFIG_CRASH);
      this.add.image(0, this.scale.height, "atlas", "Floor-0").setOrigin(0, 1);
      this.addColliders();
      this.cameraFX = this.cameras.main.postFX.addColorMatrix();
      this.addTextLabels();
      this.addEvents();
    }
    addColliders() {
      this.physics.world.on("worldbounds", (body, up, down) => {
        if (down) {
          body.enable = false;
          this.sound.play("ground", { volume: SOUND_LEVELS.crash });
          this.prtCrash.emitParticle(10, body.x, body.y);
          if (body.width == this.player.width) {
            this.prtSmoke.x = this.player.x;
            this.prtSmoke.y = this.player.y;
            this.prtSmoke.emitting = true;
          }
          this.cameras.main.shake(100, 0.01);
        }
      });
      const bulletCollider = this.physics.add.collider(this.player.bullet, this.enemies.activeEnemies, (bullet, enemy) => {
        bullet.reset();
        this.prtExplosion.emitParticle(40, enemy.x, enemy.y);
        this.sound.play("explode", { volume: SOUND_LEVELS.explode });
        this.enemies.explode(enemy);
        this.hits++;
        this.accuracy = Math.round(this.hits / this.totalShoots * 100) / 100;
        this.updateScore(Math.round(HIT_SCORE * this.accuracy));
      });
      this.physics.add.collider(this.player, [this.enemies.bullets, ...this.enemies.activeEnemies], () => {
        this.prtExplosion.emitParticle(60, this.player.x, this.player.y);
        this.player.explode();
        bulletCollider.active = false;
        this.enemiesShootTimer.remove(false);
        this.enemies.regroup();
        this.cameraFX.desaturateLuminance();
        this.sound.play("explode", { volume: SOUND_LEVELS.explode, rate: 0.5 });
        this.txtGameOver.setVisible(true);
        if (this.score > this.best) {
          this.best = this.score;
          window.localStorage.setItem("best", this.score);
          this.txtBest.setText(this.best);
        }
        this.tweens.add({
          targets: this.txtGameOver,
          scale: 8,
          duration: 2e3,
          onComplete: () => {
            this.sound.play("gameover");
            this.txtClick.setVisible(true);
            this.input.once("pointerdown", () => {
              this.sound.stopAll();
              this.cameras.main.fadeOut(1e3);
              this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("menu"));
            });
          }
        });
      });
      this.physics.add.collider(this.shields.activeShields, this.enemies.bullets, (shield, bullet) => {
        bullet.reset();
        this.prtShieldHit.setPosition(shield.x, shield.y - shield.height / 2);
        this.prtShieldHit.particleAngle = { min: -135, max: -45 };
        this.prtShieldHit.emitParticle(10);
        this.shields.hit(shield);
      });
      this.physics.add.collider(this.player.bullet, this.shields.activeShields, (bullet, shield) => {
        bullet.reset();
        this.prtShieldHit.setPosition(shield.x, shield.y + shield.height / 2);
        this.prtShieldHit.particleAngle = { min: 135, max: 45 };
        this.prtShieldHit.emitParticle(10);
        this.shields.hit(shield);
      });
    }
    addEvents() {
      this.events.on("enemies-ready", this.onEnemiesReady, this);
      this.events.on("player-shoot", () => this.totalShoots++);
      this.events.once("shutdown", () => {
        this.events.off("enemies-ready");
        this.enemiesShootTimer.remove(false);
        this.enemies = null;
        this.player = null;
      });
    }
    addTextLabels() {
      this.add.bitmapText(20, 8, "pixelfont", "score").setOrigin(0.5).setDepth(100);
      this.txtScore = this.add.bitmapText(20, 16 + 1, "pixelfont", "0").setOrigin(0.5).setDepth(100);
      this.add.bitmapText(this.scale.width - 40, 8, "pixelfont", "high score").setOrigin(0.5).setDepth(100);
      this.txtBest = this.add.bitmapText(this.scale.width - 40, 16 + 1, "pixelfont", this.best).setOrigin(0.5).setDepth(100);
      this.txtGameOver = this.add.bitmapText(CENTER.x, CENTER.y - 40, "pixelfont", "game over").setVisible(false).setOrigin(0.5).setDepth(100);
      this.txtClick = this.add.bitmapText(CENTER.x, CENTER.y + 20, "pixelfont", "click to return").setVisible(false).setOrigin(0.5).setDepth(100);
    }
    updateScore(points) {
      this.score += points;
      this.txtScore.setText(this.score);
    }
    onEnemiesReady() {
      this.enemiesShootTimer = this.time.addEvent({
        delay: 1e3,
        callback: () => {
          this.enemies.shoot();
        },
        callbackScope: this,
        loop: true
      });
    }
    update(time, delta) {
      this.enemies.update(delta);
    }
  };

  // games/invader/src/index.js
  if (false) {
    new EventSource("/esbuild").addEventListener("change", () => location.reload());
  }
  var COLORS2 = window.COLORS = {
    background: "#0a0c0c",
    foreground: "#1a1c2c"
  };
  function runGame() {
    let config = {
      type: Phaser.AUTO,
      width: 640,
      height: 360,
      parent: "game",
      pixelArt: true,
      zoom: 2,
      backgroundColor: COLORS2.background,
      physics: {
        default: "arcade",
        arcade: {
          debug: false
        }
      },
      scene: [Load, Menu, GamePlay]
    };
    window.CENTER = {
      x: config.width / 2,
      y: config.height / 2
    };
    new Phaser.Game(config);
  }
  window.onload = function() {
    runGame();
  };
})();
