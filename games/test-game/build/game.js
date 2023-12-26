(() => {
  // games/test-game/src/scenes/load.js
  var Load = class extends Phaser.Scene {
    constructor() {
      super("load");
    }
    preload() {
      this.text_loading = this.add.text(CENTER.x, CENTER.y, "Loading ...", { fontSize: 32, color: COLORS.foreground });
      this.load.on("complete", function() {
        this.createFont();
        this.scene.start("menu");
      }, this);
      this.load.image("font7x10", "/assets/imgs/font7x10.png");
      this.load.on("progress", this.updateText, this);
    }
    // End preload()
    createFont() {
      const config = {
        image: "font7x10",
        width: 7,
        height: 10,
        chars: "0123456789abcdefghijklmnopqrstuvwxyz?!.,+-* ",
        charsPerRow: 10,
        offset: { x: 0, y: 0 },
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

  // games/test-game/src/scenes/menu.js
  var Menu = class extends Phaser.Scene {
    constructor() {
      super("menu");
    }
    create() {
      this.add.bitmapText(CENTER.x, CENTER.y / 3 + 40, "pixelfont", "menu scene").setScale(4).setTint(1711148).setOrigin(0.5);
      this.add.bitmapText(CENTER.x, CENTER.y / 3 + 40 * 2, "pixelfont", "click to play").setTint(1711148).setOrigin(0.5);
      this.input.on("pointerdown", () => {
        this.scene.start("gameplay");
      });
    }
  };

  // games/test-game/src/scenes/gameplay.js
  var GamePlay = class extends Phaser.Scene {
    constructor() {
      super("gameplay");
    }
    create() {
      this.add.bitmapText(CENTER.x, CENTER.y / 3 + 40, "pixelfont", "gameplay scene").setScale(4).setTint(1711148).setOrigin(0.5);
    }
  };

  // games/test-game/src/index.js
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
