import Phaser from 'phaser';
import { adjustForPixelRatio } from "@jostein-skaar/common-game";


export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'preload-scene' });
  }

  init(): void {
  }

  preload() {
    console.log('preload-scene');

    this.load.multiatlas(
        "sprites",
        `/assets/sprites@${adjustForPixelRatio(1)}.json?v={VERSJON}`,
        "/assets",
    );    
  }

  create() {
    // setTimeout(() => {
      this.scene.start("main-scene");
      // });
  }
}