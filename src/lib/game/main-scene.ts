import { adjustForPixelRatio } from "@jostein-skaar/common-game";
import Phaser, { type GameObjects } from "phaser";

export class MainScene extends Phaser.Scene {
	width!: number;
	height!: number;
	worldWidth!: number;
	worldHeight!: number;
	cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	hero!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	enemyGroup!: Phaser.Physics.Arcade.Group;
	platformGroup!: Phaser.Physics.Arcade.StaticGroup;

	settings = {
		walkVelocity: adjustForPixelRatio(200),
		tileSize: adjustForPixelRatio(32),
		widthTileCount: 32,
		heightTileCount: 32,	
		slackingTime: 5000,
		warningTime: 2500,
	};

	control = {
		up: false,
		left: false,
		right: false,
		down: false,
		shoot: false
	};

	score = 0;
	hasLost = false;
	cursorButtonAlpha = 0.6;
	minimap!: Phaser.Cameras.Scene2D.Camera;
	backgroundLayer!: Phaser.Physics.Arcade.StaticGroup;
	allowSlacking = true;
	startStopTimer = false;
	hasStopped = false;
	timeSinceStopped = 0;
	isSlacking = false;	
	slackingInterval = 0;
	losingText!: GameObjects.Text;
	scoreText!: GameObjects.Text;



	constructor() {
		super("main-scene");
	}

	init(): void {
		this.width = this.game.scale.gameSize.width;
		this.height = this.game.scale.gameSize.height;

		this.worldWidth = this.settings.widthTileCount * this.settings.tileSize;
		this.worldHeight = this.settings.heightTileCount * this.settings.tileSize;

		console.log("MainScene init canvas size", this.width, this.height);
		console.log("MainScene init world size", this.worldWidth, this.worldHeight);
	}

	create(): void {
		this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
		this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

		this.minimap = this.cameras
			.add(
				this.width - adjustForPixelRatio(100),
				0,
				adjustForPixelRatio(100),
				adjustForPixelRatio(100),
			)
			.setZoom(0.1)
			.setOrigin(0, 0)
			.setBackgroundColor(0xbf999999)
			.setName("mini");
		// this.minimap.setBackgroundColor(0x999999);

		this.backgroundLayer = this.physics.add.staticGroup();
		const tiles = ["tiles-001.png", "tiles-002.png"];
		const tileSize = this.settings.tileSize;
		const rows = this.settings.heightTileCount;
		const cols = this.settings.widthTileCount;

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const tileKey = tiles[(row + col) % tiles.length];
				this.backgroundLayer
					.create(col * tileSize, row * tileSize, "sprites", tileKey)
					.setOrigin(0, 0);
			}
		}
		this.minimap.ignore(this.backgroundLayer);

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		this.cursors = this.input.keyboard!.createCursorKeys();

		const upPositionX = this.width - adjustForPixelRatio(145);
		const upPositionY = this.height - adjustForPixelRatio(200);
		const leftRightPositionY = upPositionY + adjustForPixelRatio(56);
		const leftPositionX = upPositionX - adjustForPixelRatio(58);
		const rightPositionX = upPositionX + adjustForPixelRatio(58);
		const downPositionX = upPositionX;
		const downPositionY = upPositionY + adjustForPixelRatio(56*2);
		const shootPositionX = upPositionX;
		const shootPositionY = upPositionY + adjustForPixelRatio(56);
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
			.setScrollFactor(0)
			.on("pointerdown", () => {
				this.control.up = true;
				this.allowSlacking = false;
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
			.setScrollFactor(0)
			.on("pointerdown", () => {
				this.control.left = true;
				this.allowSlacking = false;
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
			.setScrollFactor(0)
			.on("pointerdown", () => {
				this.control.right = true;
				this.allowSlacking = false;
			})
			.on("pointerout", () => {
				this.control.right = false;
			})
			.on("pointerup", () => {
				this.control.right = false;
			});


		const buttonShoot = this.add
			.text(shootPositionX, shootPositionY, "⚡", {
				padding: { x: adjustForPixelRatio(5), y: adjustForPixelRatio(5) },
				fontSize: fontSizeCursorButtons,
				color: "#222",
			})
			.setDepth(1)
			.setAlpha(this.cursorButtonAlpha)
			.setInteractive()
			.setScrollFactor(0)
			.on("pointerdown", () => {
				this.control.shoot = true;
				this.allowSlacking = false;
			})
			.on("pointerout", () => {
				this.control.shoot = false;
			})
			.on("pointerup", () => {
				this.control.shoot = false;
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
			.setScrollFactor(0)
			.on("pointerdown", () => {
				this.control.down = true;
				this.allowSlacking = false;
			})
			.on("pointerout", () => {
				this.control.down = false;
			})
			.on("pointerup", () => {
				this.control.down = false;
			});
		this.minimap.ignore(buttonUp);
		this.minimap.ignore(buttonLeft);
		this.minimap.ignore(buttonRight);
		this.minimap.ignore(buttonDown);
		this.minimap.ignore(buttonShoot);

		const hideCursorButtons = () => {
			if (this.cursorButtonAlpha > 0) {
				this.cursorButtonAlpha = 0;
				buttonUp.setAlpha(this.cursorButtonAlpha);
				buttonLeft.setAlpha(this.cursorButtonAlpha);
				buttonRight.setAlpha(this.cursorButtonAlpha);
				buttonDown.setAlpha(this.cursorButtonAlpha);
				buttonShoot.setAlpha(this.cursorButtonAlpha);
			}
		};

		this.cursors.up.onDown = () => {
			this.control.up = true;
			hideCursorButtons();
			this.allowSlacking = false;
		};
		this.cursors.up.onUp = () => {
			this.control.up = false;
		};

		this.cursors.left.onDown = () => {
			this.control.left = true;
			hideCursorButtons();
			this.allowSlacking = false;
		};
		this.cursors.left.onUp = () => {
			this.control.left = false;
		};
		this.cursors.right.onDown = () => {
			this.control.right = true;
			hideCursorButtons();
			this.allowSlacking = false;
		};
		this.cursors.right.onUp = () => {
			this.control.right = false;
		};

		this.cursors.down.onDown = () => {
			this.control.down = true;
			hideCursorButtons();
			this.allowSlacking = false;
		};
		this.cursors.down.onUp = () => {
			this.control.down = false;
		};

		this.cursors.space.onDown = () => {
			this.control.shoot = true;
			hideCursorButtons();
			this.allowSlacking = false;
		};
		this.cursors.space.onUp = () => {
			this.control.shoot = false;
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
		this.cameras.main.startFollow(this.hero, true);

		this.physics.add.collider(this.hero, this.platformGroup);
		this.physics.add.collider(this.enemyGroup, this.platformGroup);
		this.physics.add.collider(this.enemyGroup, this.hero);

		// this.physics.add.overlap(
		// 	this.hero,
		// 	this.enemyGroup,
		// 	// @ts-expect-error(TODO: Need to find out how to fix this)
		// 	(_hero, enemy: Phaser.Types.Physics.Arcade.ImageWithStaticBody) => {
		// 		this.killEnemy(enemy);
		// 	},
		// );

		this.losingText = this.add
		.text(this.width / 2, this.height / 4, 'HEY!\nFix the\nproblems!', {
			fontSize: `${adjustForPixelRatio(40)}px`,
			color: '#ff6600',
			fontStyle: 'bold',
			align: 'center'
		})
		.setOrigin(0.5, 0.5)
		.setDepth(1)
		.setScrollFactor(0)
		.setVisible(false);
	this.minimap.ignore(this.losingText);

	this.tweens.add({
		targets: this.losingText,
		// x: this.bredde,
		scale: 0.9,
		ease: 'Elastic',
		duration: 250,
		yoyo: true,
		repeat: -1
	});

	this.scoreText = this.add
	.text(adjustForPixelRatio(10), adjustForPixelRatio(20), '', {
		fontSize: adjustForPixelRatio(20) + 'px',
		color: '#ff6600',
		backgroundColor: '#f7f7f7',
		padding: { x: adjustForPixelRatio(5), y: adjustForPixelRatio(5) },
	})
	.setDepth(1)
	.setScrollFactor(0);
	this.minimap.ignore(this.scoreText);

	this.hasLost = false;
	this.score = 0;
	this.timeSinceStopped = 0;

	setInterval(() => {
		this.spawnNewEnemy(true);
	}, 2000);
	}

	update(_time: number, delta: number): void {
		if (this.control.left) {
			this.hero.setVelocityX(-this.settings.walkVelocity);
			this.hero.setVelocityY(0);
			this.hero.setAngle(90);
			this.hasStopped = false;
		} else if (this.control.right) {
			this.hero.setVelocityX(this.settings.walkVelocity);
			this.hero.setVelocityY(0);
			this.hero.setAngle(-90);
			this.hasStopped = false;
		} else if (this.control.up) {
			this.hero.setVelocityX(0);
			this.hero.setVelocityY(-this.settings.walkVelocity);
			this.hero.setAngle(180);
			this.hasStopped = false;
		} else if (this.control.down) {
			this.hero.setVelocityX(0);
			this.hero.setVelocityY(this.settings.walkVelocity);
			this.hero.setAngle(0);
			this.hasStopped = false;
		} 
		else if (this.control.shoot) {			
			console.log("shoot");
			this.hasStopped = false;
		}
		else {
			this.hero.setVelocityX(0);
			this.hero.setVelocityY(0);
			this.hasStopped = true;
		}

		if (this.hasStopped === false) {
			this.startStopTimer = true;
		}

		if (this.allowSlacking) {
			this.timeSinceStopped = 0;
		}

		if (this.startStopTimer && this.hasStopped) {
			this.timeSinceStopped += delta;
		} else {
			this.timeSinceStopped = 0;
		}

		if (this.timeSinceStopped > this.settings.slackingTime) {
			this.lose();
			if(this.slackingInterval === 0)
			{
				console.log("START spawn enemies interval")
				this.slackingInterval = setInterval(() => {
					console.log("Spawn enemies interval", this.slackingInterval)
				}, 1000);
			}			
		}
		else {
			if(this.slackingInterval !== 0) {
				clearInterval(this.slackingInterval);
				this.slackingInterval = 0;
				console.log("STOP spawn enemies interval")
			}
		}

		if (this.timeSinceStopped > this.settings.warningTime) {
			this.losingText.setVisible(true);
		} else {
			this.losingText.setVisible(false);
		}
		
		const text = `Fixed: ${this.score}\nRemaining: ${10000}`;
		this.scoreText.setText(text);

		// if (_time > 6000) {
		// 	this.lose();
		// }
	}

	private resetHeroPosition() {
		this.hero.setPosition(
			this.worldWidth / 2 - this.hero.width / 2,
			this.worldHeight / 2 - this.hero.height / 2,
		).setAngle(180);
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
		this.hero.setTint(0xff0000);
		this.cameras.main.setBackgroundColor(0xbababa);
		this.cameras.main.setAlpha(0.5);
		this.losingText.setVisible(false);

		this.scene.launch('lost-scene');
	}

	private spawnNewEnemy(isFirst = false) {
		let enemy: Phaser.Physics.Arcade.Image = this.enemyGroup.getFirstDead();
		const x = this.hero.x;
		const y = this.hero.y - this.hero.height*3;
		if(enemy) {
			enemy.enableBody(true, x, y, true, true);
		}
		else {
			enemy = this.enemyGroup.create(x, y, 'sprites', 'enemies-001.png');
		enemy.setCollideWorldBounds(true);
		}

		
	}
}
