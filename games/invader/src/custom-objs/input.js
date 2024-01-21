export default class Controls {
    constructor(scene) {
        this.scene = scene;
        this.left = 0;
        this.right = 0;
        this.fire = 0;

        // Default keys
        this.leftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.leftKey2 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.rightKey2 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.fireKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Checks gamepad
        if (this.scene.input.gamepad.total > 0) {
            this.pad = this.scene.input.gamepad.getPad(0);
            this.padButtontPrevState = 0;
        } else {
            scene.input.gamepad.once('connected', pad => {
                this.pad = pad;
            });
        }

        scene.events.on("update", () => this.update());
        scene.events.once("shutdown", () => scene.events.off("update"));
    }

    update() {
        this.reset();
        let axisH = 0;
        let fireButton = 0;
        if (this.pad) {
            axisH = this.pad.axes[0].getValue();
            const padButtonState = this.pad.buttons[0].value;
            if (padButtonState == 0) {
                this.padButtontPrevState = 0;
            }
            if (padButtonState > this.padButtontPrevState) {
                this.padButtontPrevState = padButtonState;
                fireButton = 1;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.fireKey) || fireButton) {
            this.fire = 1;
        }

        if (this.leftKey.isDown || this.leftKey2.isDown || axisH < 0) {
            this.left = 1;
            return;
        }

        if (this.rightKey.isDown || this.rightKey2.isDown || axisH > 0) {
            this.right = 1;
            return;
        }
    }

    reset() {
        this.left = this.right = this.fire = 0;
    }
}