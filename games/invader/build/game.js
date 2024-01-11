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
        this.scene.start("menu");
      }, this);
      this.load.atlas("atlas", "/assets/imgs/invader.png", "/assets/imgs/invader.json");
      this.load.audio("menu-background", "/assets/sounds/loop_space_ambience_128.mp3");
      this.load.audio("laser1", "/assets/sounds/laser1.ogg");
      this.load.audio("laser2", "/assets/sounds/laser2.ogg");
      this.load.audio("explode2", "/assets/sounds/expl2_22050.ogg");
      this.load.on("progress", this.updateText, this);
    }
    // End preload()
    createFont() {
      const config = {
        image: "atlas",
        width: 7,
        height: 10,
        chars: "0123456789abcdefghijklmnopqrstuvwxyz?!.,+-* ",
        charsPerRow: 10,
        offset: { x: 0, y: 831 },
        spacing: { x: 1, y: 1 }
      };
      this.cache.bitmapFont.add("pixelfont", Phaser.GameObjects.RetroFont.Parse(this, config));
    }
    // End createFont()
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

  // games/invader/src/utils.js
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
  function transition(srcScene, targetKey, duration) {
    srcScene.scene.launch(targetKey);
    const target = srcScene.scene.get(targetKey);
    target.cameras.main.alpha = 0;
    srcScene.tweens.chain({
      tweens: [
        {
          targets: srcScene.cameras.main,
          alpha: 0,
          duration: duration / 2
        },
        {
          targets: target.cameras.main,
          alpha: 1,
          duration: duration / 2,
          onComplete: () => {
            srcScene.scene.stop();
          }
        }
      ]
    });
  }

  // games/invader/src/scenes/menu.js
  var Menu = class extends Phaser.Scene {
    constructor() {
      super("menu");
    }
    create() {
      const snd_background = this.sound.add("menu-background", { loop: true });
      snd_background.play();
      this.add.image(0, 0, "atlas", "Background-0").setOrigin(0);
      this.anims.create(
        {
          key: "enemy-falling",
          frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy_spin-", end: 3 }),
          frameRate: 4,
          repeat: -1
        }
      );
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
      this.input.on("pointerdown", () => {
        snd_background.stop();
        transition(this, "gameplay", 2e3);
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

  // games/invader/src/custom-objs/player.js
  var PLAYER_SPEED = 120;
  var Player = class extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, "atlas", "Player-0");
      this.anims.create({ key: "player_idle", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", end: 5 }), repeat: -1 });
      this.anims.create({ key: "player_shoot", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", start: 6, end: 9 }) });
      this.anims.create({ key: "player_hit", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", start: 10, end: 12 }), frameRate: 4 });
      this.play("player_idle");
      this.scene.physics.add.existing(this);
      this.enableBody();
      this.bullet = scene.add.existing(new Bullet("Bullet-0", -200, scene));
      this.leftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.rightKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.shootKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.shootSound = this.scene.sound.add("laser1");
    }
    preUpdate(time, delta) {
      super.preUpdate(time, delta);
      if (Phaser.Input.Keyboard.JustDown(this.shootKey) && !this.bullet.active) {
        this.chain(["player_shoot", "player_idle"]);
        this.stop();
        this.shootSound.play();
        this.bullet.shoot(this.x, this.y);
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
  };

  // games/invader/src/custom-objs/enemy.js
  var MOVE_RANGE = 14;
  var FPS = 12;
  var TIME_PER_FRAME = 1e3 / FPS;
  var Y_POSITIONS = genOscPositions(MOVE_RANGE);
  var Enemy = class extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, offsetX, offsetY, anchor, bullets) {
      super(scene, 0, 0, "atlas", "Enemy-0");
      this.scene = scene;
      this.anchor = anchor;
      this.offsetX = offsetX;
      this.offsetY = offsetY;
      this.countDown = TIME_PER_FRAME;
      this.yPosIdx = Phaser.Math.Between(0, Y_POSITIONS.length - 1);
      this.x = offsetX + anchor.x;
      this.y = offsetY + Y_POSITIONS[this.yPosIdx] + anchor.y;
      this.anims.create({ key: "enemy_idle", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy-", end: 4 }), repeat: -1 });
      this.anims.create({ key: "enemy_shoot", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy-", start: 5, end: 8 }) });
      this.anims.create({ key: "enemy_explode", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy-", start: 9, end: 14 }), frameRate: 5 });
      this.play("enemy_idle");
      this.scene.physics.add.existing(this);
      this.enableBody();
      this.setDirectControl();
      this.bullets = bullets;
    }
    shoot() {
      this.chain(["enemy_shoot", "enemy_idle"]);
      this.stop();
      let b = this.bullets.getFirst();
      if (b) {
        this.shootSound.play();
        b.shoot(this.x, this.y);
      }
    }
    explode() {
      this.parentGroup.remove(this);
      this.setDirectControl(false);
      this.body.setGravityY(100);
      this.body.setAngularVelocity(Phaser.Math.Between(-30, 30));
      this.play("enemy_explode");
    }
    preUpdate(time, delta) {
      super.preUpdate(time, delta);
      if (this.body.gravity.y > 0) {
        if (this.y > this.scene.scale.height - 4) {
          this.body.setGravityY(0);
          this.body.reset(this.x, this.y);
          this.body.setEnable(false);
          this.active = false;
          this.emitter.emitParticle(10, this.x, this.y);
        }
        return;
      }
      ;
      this.countDown -= delta;
      if (this.countDown < 0) {
        this.countDown = TIME_PER_FRAME;
        this.yPosIdx = Phaser.Math.Wrap(++this.yPosIdx, 0, Y_POSITIONS.length);
        this.setY(this.offsetY + Y_POSITIONS[this.yPosIdx] + this.anchor.y);
      }
      this.setX(this.anchor.x + this.offsetX);
    }
  };

  // games/invader/src/custom-objs/enemies.js
  var ROW_SIZE = 11;
  var COLUMN_SIZE = 4;
  var ITEM_PADDING = 8;
  var ITEM_WIDTH = 24;
  var GROUP_MARGIN = 6;
  var SPEED_INIT = 20;
  var SPEED_STEP = 5;
  var BULLET_SPEED = 200;
  var BULLETS_POOL_SIZE = 4;
  var DIRECTION = {
    left: -1,
    right: 1
  };
  var Enemies = class extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
      super(scene.physics.world, scene);
      this.anchor = {
        x: scene.scale.width / 2,
        y: (COLUMN_SIZE * ITEM_WIDTH + (COLUMN_SIZE - 1) * ITEM_PADDING) / 2 + GROUP_MARGIN
      };
      this.speed = SPEED_INIT;
      this.direction = DIRECTION.right;
      this.bullets = scene.physics.add.group({ classType: Bullet });
      for (let i = 0; i < BULLETS_POOL_SIZE; i++) {
        this.bullets.add(new Bullet("Bullet-1", BULLET_SPEED, scene));
      }
      this.expl = scene.add.particles(0, 0, "atlas", {
        frame: "Smoke-0",
        lifespan: 1e3,
        speed: { min: 10, max: 20 },
        scale: { max: 2, min: 0.5 },
        alpha: { start: 1, end: 0 },
        gravityY: 4,
        emitting: false
      });
      const snd_shoot = scene.sound.add("laser2");
      const offsetX0 = -(ROW_SIZE * ITEM_WIDTH + (ROW_SIZE - 1) * ITEM_PADDING) / 2 + ITEM_WIDTH / 2;
      const offsetY0 = -(COLUMN_SIZE * ITEM_WIDTH + (COLUMN_SIZE - 1) * ITEM_PADDING) / 2 + GROUP_MARGIN + ITEM_WIDTH / 2;
      for (let i = 0; i < COLUMN_SIZE; i++) {
        for (let j = 0; j < ROW_SIZE; j++) {
          let enemy = new Enemy(
            scene,
            offsetX0 + j * (ITEM_PADDING + ITEM_WIDTH),
            offsetY0 + i * (ITEM_PADDING + ITEM_WIDTH),
            this.anchor,
            this.bullets
          );
          enemy.column = j;
          enemy.parentGroup = this;
          enemy.emitter = this.expl;
          enemy.shootSound = snd_shoot;
          this.add(enemy, true);
        }
      }
    }
    preUpdate(time, delta) {
      super.preUpdate(time, delta);
      this.checkBounds();
      this.anchor.x += this.speed * this.direction * delta / 1e3;
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
          duration: 1e3,
          onUpdate: () => {
            this.anchor.y = tween.getValue();
          }
        });
      }
    }
    shoot() {
      const enemies = this.getMatching("active", true);
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
      shooter.shoot();
    }
  };

  // games/invader/src/scenes/gameplay.js
  var GamePlay = class extends Phaser.Scene {
    constructor() {
      super("gameplay");
    }
    create() {
      this.anchor = {
        x: CENTER.x,
        y: CENTER.y
      };
      const explodeSound = this.sound.add("explode2");
      this.add.image(0, 0, "atlas", "Background-0").setOrigin(0).setTint(8947848);
      this.add.image(0, this.scale.height, "atlas", "Ruins3-0").setOrigin(0, 1).setTint(6710886);
      const player = this.add.existing(new Player(this, CENTER.x, this.scale.height - 20));
      const enemies = this.add.existing(new Enemies(this));
      this.add.image(0, this.scale.height, "atlas", "Floor-0").setOrigin(0, 1);
      this.time.addEvent({
        delay: 1e3,
        callback: () => {
          enemies.shoot();
        },
        callbackScope: this,
        loop: true
      });
      const expl = this.add.particles(0, 0, "atlas", {
        frame: "Particle-yellow",
        lifespan: 2e3,
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
      this.physics.add.collider(player, [enemies.bullets, enemies], () => {
        console.log("game over");
      });
    }
  };

  // games/invader/src/index.js
  if (false) {
    new EventSource("/esbuild").addEventListener("change", () => location.reload());
  }
  var COLORS2 = window.COLORS = {
    background: "#f4f4f4",
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
