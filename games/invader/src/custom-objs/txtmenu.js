export default class Menu {
    constructor(scene, x, y, font, items, options) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.font = font;
        this.items = items;
        this.color = options.color || 0xcccccc;
        this.hoverColor = options.hoverColor || 0xffffff;
        this.padding = options.padding || 2;
        this.hoverSound = options.hoverSound;
        this.buttons = [];

        this.createButtons();
        this.init();
        return this;
    }

    createButtons() {
        this.items.forEach(item => {

            let button = this.scene.add.bitmapText(0, 0, this.font, item.name)
                .setVisible(false)
                .setOrigin(0.5)
                .setTint(this.color)
                .setInteractive();

            button.fn = item.fn;

            button.on("pointerover", () => {
                button.setTint(this.hoverColor);
                if(this.hoverSound){
                    this.scene.sound.play(this.hoverSound);
                }
            });

            button.on("pointerout", () => {
                button.setTint(this.color);
            });

            button.on("pointerdown", item.fn, this.scene);

            this.buttons.push(button);
        });
    } // End createButtons



    init() {
        this.lineHeight = getLineHeight(this.buttons);
        this.width = getWidth(this.buttons);
        this.height = getHeight(this.buttons, this.padding, this.lineHeight);
        this.initButtons();
    }

    initButtons() {
        let x0 = this.x;
        let y0 = this.y - this.height / 2;
        this.buttons.forEach(b => {
            b.setPosition(x0, y0);
            b.setVisible(true);
            y0 += this.lineHeight + this.padding;
        });
    }

    setScale(scale) {
        this.buttons.forEach(b => b.setScale(scale));
        this.init();
        return this;
    }

    setVisible(isVisible) {
        this.buttons.forEach(b => b.setVisible(isVisible));
        return this;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.initButtons();
        return this;
    }
}

//// PRIVATE FUNCTIONS ////////////////////////

function getLineHeight(buttons) {
    return buttons[0].height;
}

function getHeight(buttons, padding, lineHeight) {
    return buttons.length + (buttons.length - 1) * (padding + lineHeight);
}

function getWidth(buttons) {
    let width = 0;
    buttons.forEach(b => {
        if (b.width > width) {
            width = b.width;
        }
    });

    return width;
}