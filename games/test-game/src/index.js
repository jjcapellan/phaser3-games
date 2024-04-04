import Load from "./scenes/load.js";
import Menu from "./scenes/menu.js";
import GamePlay from "./scenes/gameplay.js";

// Hot reloading esbuild
if (IS_DEV) {
    new EventSource("/esbuild").addEventListener("change", () => location.reload());
}

const COLORS = window.COLORS = {
    background: "#f4f4f4",
    foreground: "#1a1c2c"
}

function runGame() {
    let config = {
        type: Phaser.AUTO,
        width: 640,
        height: 360,
        parent: "game",
        pixelArt: true,
        zoom: 2,
        backgroundColor: COLORS.background,
        physics: {
            default: "arcade",
            arcade: {
                debug: false,
            }
        },
        loader: {
            baseURL: "../../assets/"
        },
        scene: [Load, Menu, GamePlay],
    };

    window.CENTER = {
        x: config.width/2,
        y: config.height/2
    }

    new Phaser.Game(config);
}

window.onload = function () {
    runGame();
};