import { adjustForPixelRatio } from "@jostein-skaar/common-game";
import Phaser, { type GameObjects } from "phaser";

export class MainScene extends Phaser.Scene {
	width!: number;
	height!: number;
	cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	hero!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	enemyGroup!: Phaser.Physics.Arcade.Group;
	platformGroup!: Phaser.Physics.Arcade.StaticGroup;

	settings = {
		walkVelocity: adjustForPixelRatio(200),
	};

	control = {
		up: false,
		left: false,
		right: false,
		down: false,
	};

	score = 0;
	hasLost = false;
	cursorButtonAlpha = 0.6;

	constructor() {
		super("main-scene");
	}

	init(): void {
		this.width = this.game.scale.gameSize.width;
		this.height = this.game.scale.gameSize.height;

		console.log("MainScene init", this.width, this.height);
	}

	preload(): void {
		this.load.multiatlas(
			"sprites",
			`/assets/sprites@${adjustForPixelRatio(1)}.json?v={VERSJON}`,
			"/assets",
		);
	}

	create(): void {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		this.cursors = this.input.keyboard!.createCursorKeys();

		const upPositionX = this.width - adjustForPixelRatio(145);
		const upPositionY = this.height - adjustForPixelRatio(158);
		const leftRightPositionY = upPositionY + adjustForPixelRatio(56);
		const leftPositionX = upPositionX - adjustForPixelRatio(58);
		const rightPositionX = upPositionX + adjustForPixelRatio(58);
		const downPositionX = upPositionX;
		const downPositionY = upPositionY + adjustForPixelRatio(56);
		const fontSizeCursorButtons = `${adjustForPixelRatio(54)}px`;

		const buttonUp = this.add
			.text(upPositionX, upPositionY, "⬆️", {
				padding: { x: adjustForPixelRatio(5), y: adjustForPixelRatio(5) },
				fontSize: fontSizeCursorButtons,
				color: "#222",
			})
			.setDepth(1)
			.setAlpha(this.cursorButtonAlpha)
			.setInteractive()
			.on("pointerdown", () => {
				this.control.up = true;
			})
			.on("pointerout", () => {
				this.control.up = false;
			})
			.on("pointerup", () => {
				this.control.up = false;
			});

		const buttonLeft = this.add
			.text(leftPositionX, leftRightPositionY, "⬅️", {
				padding: { x: adjustForPixelRatio(5), y: adjustForPixelRatio(5) },
				fontSize: fontSizeCursorButtons,
				color: "#222",
			})
			.setDepth(1)
			.setAlpha(this.cursorButtonAlpha)
			.setInteractive()
			.on("pointerdown", () => {
				this.control.left = true;
			})
			.on("pointerout", () => {
				this.control.left = false;
			})
			.on("pointerup", () => {
				this.control.left = false;
			});

		const buttonRight = this.add
			.text(rightPositionX, leftRightPositionY, "➡️", {
				padding: { x: adjustForPixelRatio(5), y: adjustForPixelRatio(5) },
				fontSize: fontSizeCursorButtons,
				color: "#222",
			})
			.setDepth(1)
			.setAlpha(this.cursorButtonAlpha)
			.setInteractive()
			.on("pointerdown", () => {
				this.control.right = true;
			})
			.on("pointerout", () => {
				this.control.right = false;
			})
			.on("pointerup", () => {
				this.control.right = false;
			});

		const buttonDown = this.add
			.text(downPositionX, downPositionY, "⬇️", {
				padding: { x: adjustForPixelRatio(5), y: adjustForPixelRatio(5) },
				fontSize: fontSizeCursorButtons,
				color: "#222",
			})
			.setDepth(1)
			.setAlpha(this.cursorButtonAlpha)
			.setInteractive()
			.on("pointerdown", () => {
				this.control.down = true;
			})
			.on("pointerout", () => {
				this.control.down = false;
			})
			.on("pointerup", () => {
				this.control.down = false;
			});

		const hideCursorButtons = () => {
			if (this.cursorButtonAlpha > 0) {
				this.cursorButtonAlpha = 0;
				buttonUp.setAlpha(this.cursorButtonAlpha);
				buttonLeft.setAlpha(this.cursorButtonAlpha);
				buttonRight.setAlpha(this.cursorButtonAlpha);
				buttonDown.setAlpha(this.cursorButtonAlpha);
			}
		};

		this.cursors.up.onDown = () => {
			this.control.up = true;
			hideCursorButtons();
		};
		this.cursors.up.onUp = () => {
			this.control.up = false;
		};

		this.cursors.left.onDown = () => {
			this.control.left = true;
			hideCursorButtons();
		};
		this.cursors.left.onUp = () => {
			this.control.left = false;
		};
		this.cursors.right.onDown = () => {
			this.control.right = true;
			hideCursorButtons();
		};
		this.cursors.right.onUp = () => {
			this.control.right = false;
		};

		this.cursors.down.onDown = () => {
			this.control.down = true;
			hideCursorButtons();
		};
		this.cursors.down.onUp = () => {
			this.control.down = false;
		};

		this.enemyGroup = this.physics.add.group({
			allowGravity: false,
		});
		this.platformGroup = this.physics.add.staticGroup();

		this.addPlatforms();
		this.addEnemies();

		this.hero = this.physics.add.sprite(0, 0, "sprites", "hero-001.png");
		this.resetHeroPosition();
		this.hero.setCollideWorldBounds(true);
		console.log("hero", this.hero.height, this.hero.width);

		this.hero.anims.create({
			key: "stand",
			frames: [
				{ key: "sprites", frame: "hero-001.png" },
				{ key: "sprites", frame: "hero-002.png" },
				{ key: "sprites", frame: "hero-003.png" },
				{ key: "sprites", frame: "hero-004.png" },
			],
			frameRate: 6,
			repeat: -1,
		});
		this.hero.anims.play("stand", true);

		this.physics.add.collider(this.hero, this.platformGroup);
		this.physics.add.collider(this.enemyGroup, this.platformGroup);

		this.physics.add.overlap(
			this.hero,
			this.enemyGroup,
			// @ts-expect-error(TODO: Need to find out how to fix this)
			(_hero, enemy: Phaser.Types.Physics.Arcade.ImageWithStaticBody) => {
				this.killEnemy(enemy);
			},
		);
	}

	update(_time: number, delta: number): void {
		if (this.control.left) {
			this.hero.setVelocityX(-this.settings.walkVelocity);
			this.hero.setVelocityY(0);
			this.hero.setAngle(90);
		} else if (this.control.right) {
			this.hero.setVelocityX(this.settings.walkVelocity);
			this.hero.setVelocityY(0);
			this.hero.setAngle(-90);
		} else if (this.control.up) {
			this.hero.setVelocityX(0);
			this.hero.setVelocityY(-this.settings.walkVelocity);
			this.hero.setAngle(180);
		} else if (this.control.down) {
			this.hero.setVelocityX(0);
			this.hero.setVelocityY(this.settings.walkVelocity);
			this.hero.setAngle(0);
		} else {
			this.hero.setVelocityX(0);
			this.hero.setVelocityY(0);
		}

		// if () {
		// 	this.lose();
		// }
	}

	private resetHeroPosition() {
		this.hero.setPosition(
			this.scale.width / 2 - this.hero.width / 2,
			this.scale.height / 2 - this.hero.height / 2,
		);
	}

	private addPlatforms() {
		this.platformGroup.clear(true, true);
	}

	private async addEnemies() {
		this.enemyGroup.clear(true, true);
	}

	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	private killEnemy(enemy: Phaser.Types.Physics.Arcade.ImageWithStaticBody) {
		enemy.destroy();
	}

	private lose() {
		if (this.hasLost) {
			return;
		}
		this.hasLost = true;
		this.scene.pause();
		this.cameras.main.setBackgroundColor(0xbababa);
		// this.cameras.main.setAlpha(0.5);
		setTimeout(() => {
			window.location.href = "/lose";
		}, 1200);
	}
}
