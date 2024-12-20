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
	bulletGroup!: Phaser.Physics.Arcade.Group;

	settings = {
		walkVelocity: adjustForPixelRatio(200),
		tileSize: adjustForPixelRatio(32),
		widthTileCount: 32,
		heightTileCount: 32,
		slackingTime: 3000,
		warningTime: 2000,
		enemySpawnInterval: 500,
		maxEnemies: 1000,
		minimapSize: adjustForPixelRatio((32 * 32) / 10),
		minimapZoom: 0.1,
		bulletSpeed: adjustForPixelRatio(400),
	};

	control = {
		up: false,
		left: false,
		right: false,
		down: false,
		shoot: false,
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
	isShooting = false;
	shootingInterval = 0;
	emitter!: GameObjects.Particles.ParticleEmitter;

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
				this.width - this.settings.minimapSize,
				0,
				this.settings.minimapSize,
				this.settings.minimapSize,
			)
			.setZoom(this.settings.minimapZoom)
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
		const downPositionY = upPositionY + adjustForPixelRatio(56 * 2);
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

		this.enemyGroup = this.physics.add.group();
		this.bulletGroup = this.physics.add.group();

		this.physics.add.collider(
			this.bulletGroup,
			this.enemyGroup,
			// @ts-ignore
			(
				bullet: Phaser.Physics.Arcade.Image,
				enemy: Phaser.Physics.Arcade.Image,
			) => {
				// const visibilityMargin = adjustForPixelRatio(10);
				// if (enemy.y < -enemy.width / 2 + visibilityMargin) {
				// 	return;
				// }
				// Sometimes it hits two enemies at the same time. Only one of them should disappear.
				if (!bullet.visible) {
					return;
				}
				bullet.disableBody(true, true);
				// @ts-ignore
				this.killEnemy(enemy);
				this.score += 1;
			},
		);

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

		// // Fun, but to
		// this.physics.add.collider(this.enemyGroup, this.enemyGroup);
		this.physics.add.collider(this.enemyGroup, this.hero);

		this.losingText = this.add
			.text(this.width / 2, this.height / 4, "HEY!\nFix the\nproblems!", {
				fontSize: `${adjustForPixelRatio(40)}px`,
				color: "#ff6600",
				fontStyle: "bold",
				align: "center",
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
			ease: "Elastic",
			duration: 250,
			yoyo: true,
			repeat: -1,
		});

		this.scoreText = this.add
			.text(0, 0, "", {
				fontSize: `${adjustForPixelRatio(20)}px`,
				color: "#ff6600",
				backgroundColor: "#DDDDDDbf",
				padding: { x: adjustForPixelRatio(10), y: adjustForPixelRatio(10) },
			})
			.setDepth(1)
			.setScrollFactor(0);
		this.minimap.ignore(this.scoreText);

		this.hasLost = false;
		this.score = 0;
		this.timeSinceStopped = 0;
		this.control.down = false;
		this.control.up = false;
		this.control.left = false;
		this.control.right = false;
		this.control.shoot = false;

		setTimeout(() => {
			// SPawn first enemy in front of hero after 1 second
			this.spawnNewEnemy(true);

			// Start spawning enemies in random positions
			setInterval(() => {
				this.spawnNewEnemy(false);
			}, this.settings.enemySpawnInterval);
		}, 1000);

		this.emitter = this.add.particles(0, 0, "sprites", {
			frame: "enemies-001.png",
			scale: { start: 0.8, end: 0 },
			speed: { min: 200, max: 400 },
			lifespan: 200,
			quantity: 25,
			active: false,
		});
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
		} else if (this.control.shoot) {
			this.hasStopped = false;
		} else {
			this.hero.setVelocityX(0);
			this.hero.setVelocityY(0);
			this.hasStopped = true;
		}

		if (this.control.shoot) {
			if (this.shootingInterval === 0) {
				this.fireBullet();
				// console.log("start shooting interval");
				this.shootingInterval = setInterval(() => {
					this.fireBullet();
				}, 200);
			}
		} else {
			if (this.shootingInterval !== 0) {
				clearInterval(this.shootingInterval);
				this.shootingInterval = 0;
				// console.log("stop shooting interval");
			}
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
			if (this.slackingInterval === 0) {
				console.log("start double enemies interval");
				this.slackingInterval = setInterval(() => {
					this.increaseEnemies();
				}, 1000);
			}
		} else {
			if (this.slackingInterval !== 0) {
				clearInterval(this.slackingInterval);
				this.slackingInterval = 0;
				console.log("stop double enemies interval");
			}
		}

		if (this.timeSinceStopped > this.settings.warningTime) {
			this.losingText.setVisible(true);
		} else {
			this.losingText.setVisible(false);
		}

		const unsolvedProblems = this.enemyGroup.countActive();
		if (unsolvedProblems > this.settings.maxEnemies) {
			this.lose();
		}
		const text = `Fixed: ${this.score}\nRemaining: ${unsolvedProblems}`;
		this.scoreText.setText(text);

		// @ts-ignore
		this.bulletGroup.children.iterate((bullet: Phaser.Physics.Arcade.Image) => {
			if (
				bullet.y < 0 ||
				bullet.x < 0 ||
				bullet.x > this.worldWidth ||
				bullet.y > this.worldHeight
			) {
				bullet.disableBody(true, true);
			}
		});

		// End update loop
	}

	private resetHeroPosition() {
		this.hero
			.setPosition(
				this.worldWidth / 2 - this.hero.width / 2,
				this.worldHeight / 2 - this.hero.height / 2,
			)
			.setAngle(180);
	}

	private async addEnemies() {
		this.enemyGroup.clear(true, true);
	}

	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	private killEnemy(enemy: Phaser.Types.Physics.Arcade.ImageWithStaticBody) {
		enemy.disableBody(true, true);
		const bounds = enemy.getBounds();
		this.emitter.setPosition(bounds.left, bounds.top);
		this.emitter.active = true;
		this.emitter.explode();
	}

	private lose() {
		if (this.hasLost) {
			return;
		}

		if (this.slackingInterval !== 0) {
			clearInterval(this.slackingInterval);
		}
		if (this.shootingInterval !== 0) {
			clearInterval(this.shootingInterval);
		}

		this.hasLost = true;
		this.scene.pause();
		this.cameras.main.setBackgroundColor(0xbababa);
		this.cameras.main.setAlpha(0.5);
		this.losingText.setVisible(false);

		this.scene.launch("lost-scene");
	}

	private spawnNewEnemy(isFirst = false) {
		let enemy: Phaser.Physics.Arcade.Image = this.enemyGroup.getFirstDead();

		const x = isFirst ? this.hero.x : Phaser.Math.Between(0, this.worldWidth);
		const y = isFirst
			? this.hero.y - this.hero.height * 3
			: Phaser.Math.Between(0, this.worldHeight);

		if (enemy) {
			enemy.enableBody(true, x, y, true, true);
		} else {
			enemy = this.enemyGroup.create(x, y, "sprites", "enemies-001.png");
			enemy.setCollideWorldBounds(true);
		}
	}

	private increaseEnemies() {
		const newEnemiesToSpawn = Math.ceil(this.enemyGroup.countActive() * 0.25);
		for (let i = 0; i < newEnemiesToSpawn; i++) {
			this.spawnNewEnemy(false);
		}
	}

	private fireBullet() {
		let bullet: Phaser.Physics.Arcade.Image = this.bulletGroup.getFirstDead();

		const { x, y, angle } = this.hero;

		let velocityX = 0;
		let velocityY = 0;

		let xTuppen = x;
		let yTuppen = y;

		if (angle === -180) {
			velocityY = -this.settings.bulletSpeed;
			yTuppen = y - this.hero.height / 2;
		} else if (angle === 90) {
			velocityX = -this.settings.bulletSpeed;
			xTuppen = x - this.hero.width / 2;
		} else if (angle === 0) {
			velocityY = this.settings.bulletSpeed;
			yTuppen = y + this.hero.height / 2;
		} else if (angle === -90) {
			velocityX = this.settings.bulletSpeed;
			xTuppen = x + this.hero.width / 2;
		}

		if (bullet) {
			bullet.enableBody(true, xTuppen, yTuppen, true, true);
		} else {
			bullet = this.bulletGroup.create(
				xTuppen,
				yTuppen,
				"sprites",
				"bullet-001.png",
			);
		}

		// console.log("angle", angle);
		// console.log("velocityX", velocityX, "velocityY", velocityY);

		bullet.setImmovable(true).setVelocity(velocityX, velocityY).setAngle(angle);
	}
}
