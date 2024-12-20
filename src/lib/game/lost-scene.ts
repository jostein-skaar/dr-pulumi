import { adjustForPixelRatio } from "@jostein-skaar/common-game";
import Phaser from "phaser";

export class LostScene extends Phaser.Scene {
	width!: number;
	height!: number;
	cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

	constructor() {
		super({ key: "lost-scene" });
	}

	init() {
		this.width = this.game.scale.gameSize.width;
		this.height = this.game.scale.gameSize.height;
	}

	create() {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		this.cursors = this.input.keyboard!.createCursorKeys();

		const tekst = "Too many problems!\nTap to try again\n(Wait to quit)";
		this.add
			.text(this.width / 2, this.height / 2, tekst, {
				fontFamily: "arial",
				fontSize: `${adjustForPixelRatio(20)}px`,
				color: "#fff",
				align: "center",
				backgroundColor: "#ff6600",
				padding: { x: adjustForPixelRatio(25), y: adjustForPixelRatio(25) },
			})
			.setOrigin(0.5, 0.5);

		const goToHomeTimeout = setTimeout(() => {
			this.scene.stop();
			window.location.href = "/";
		}, 5000);

		setTimeout(() => {
			this.input.once("pointerdown", () => {
				clearTimeout(goToHomeTimeout);
				this.scene.start("main-scene");
			});
			this.cursors.space.onDown = () => {
				clearTimeout(goToHomeTimeout);
				this.scene.start("main-scene");
			};
		}, 500);
	}
}
