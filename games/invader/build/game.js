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

  // node_modules/.pnpm/phaser3-scrollinglayer@2.0.2/node_modules/phaser3-scrollinglayer/dist/scrollinglayer.esm.js
  var ScrollingLayer = class {
    /**
     *Creates an instance of ScrollingLayer.
     * @param scene     
     * @param speed - Horizontal speed in pixels/second.    
     * @param texture - Key of the texture stored in cache.
     * @param [options]
     * @param [options.frame] - Optional frame of the texture.
     * @param [options.y = 0] - vertical position in pixels. By default the texture is positioned at bottom.
     * @param [options.overlap = 0] - Horizontal overlap in pixels (default 1). Prevents empty spaces between images.
     * @memberof ScrollingLayer
     */
    constructor(scene, speed, texture, options) {
      this.scene = scene;
      this.speed = speed;
      this.texture = texture;
      this.frame = options.frame;
      this.overlap = options.overlap || 1;
      this.width = this.scene.textures.getFrame(this.texture, this.frame).width;
      this.height = this.scene.textures.getFrame(this.texture, this.frame).height;
      this.y = options.y || this.setYbottom();
      this.blitter = this.scene.add.blitter(0, this.y, this.texture, this.frame);
      this.img1 = this.blitter.create(0, 0);
      this.img2 = this.blitter.create(this.width - this.overlap, 0);
    }
    getDistance(speed, deltaTime) {
      return deltaTime * speed / 1e3;
    }
    setYbottom() {
      return this.scene.game.config.height - this.height;
    }
    /**
     * Updates the x position.
     * @param delta - Duration of last game step in miliseconds
     * @memberof ScrollingLayer
     */
    update(delta) {
      this.img1.x += this.getDistance(this.speed, delta);
      this.img2.x += this.getDistance(this.speed, delta);
      if (this.speed < 0 && this.img1.x < -this.width) {
        this.img1.x = this.width + this.img2.x - this.overlap;
      }
      if (this.speed < 0 && this.img2.x < -this.width) {
        this.img2.x = this.width + this.img1.x - this.overlap;
      }
      if (this.speed > 0 && this.img1.x > this.width) {
        this.img1.x = -this.width + this.img2.x + this.overlap;
      }
      if (this.speed > 0 && this.img2.x > this.width) {
        this.img2.x = -this.width + this.img1.x + this.overlap;
      }
    }
  };
  if (false) {
    window.ScrollingLayer = ScrollingLayer;
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
      this.fog = new ScrollingLayer(
        this,
        -10,
        "atlas",
        {
          frame: "Fog-0",
          y: this.scale.height - 30,
          overlap: 0
        }
      );
      this.add.image(0, this.scale.height, "atlas", "Ruins1-0").setOrigin(0, 1);
      this.add.bitmapText(CENTER.x, CENTER.y / 3 + 40, "pixelfont", "invader").setScale(8).setTint(1711148).setOrigin(0.5);
      this.add.bitmapText(CENTER.x, CENTER.y / 3 + 40 * 2, "pixelfont", "click to play").setOrigin(0.5);
      this.input.on("pointerdown", () => {
        snd_background.stop();
        this.scene.start("gameplay");
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
    update(time, delta) {
      this.ships.forEach((ship) => {
        ship.y += ship.speed;
        ship.x += ship.speed;
        if (ship.y > this.scale.height) {
          this.resetShip(ship);
        }
      });
      this.fog.update(delta);
    }
  };

  // games/invader/src/scenes/gameplay.js
  var GamePlay = class extends Phaser.Scene {
    constructor() {
      super("gameplay");
    }
    create() {
      this.add.bitmapText(CENTER.x, CENTER.y / 3 + 40, "pixelfont", "gameplay scene").setScale(4).setTint(1711148).setOrigin(0.5);
    }
  };

  // games/invader/src/index.js
  if (true) {
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
//# sourceMappingURL=game.js.map
