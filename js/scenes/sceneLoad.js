/**
* File: SceneLoad.js
* Author: Ken
*
* The first scene of the game: displays a progress bar while loading all assets.
*
* Copyright (C) November 2019, Ken Samonte
 */

class SceneLoad extends Phaser.Scene {
  constructor() {
    super("SceneLoad");
  }

  preload() {
    // Loading Progress Bar
    this.bar = new Bar({ scene: this, x: 240, y: 320 })
    this.bar.setPercent(0.5);

    this.progText = this.add.text(
      game.config.width / 2,
      game.config.height / 2,
      '0%',
      {
        color: "#ffffff",
        fontFamily: "Varela Round", fontSize: game.config.width / 20
      }
    );
    this.progText.setOrigin(0.5, 0.5);
    this.load.on("progress", this.onProgress, this);

    // Audio
    this.load.audio("backgroundMusic", ["./audio/red-armor.mp3", "./audio/red-armor.ogg"]);
    this.load.audio("explode", ["./audio/explode.wav", "./audio/explode.ogg"]);
    this.load.audio("enemyShoot", ["./audio/enemyShoot.wav", "./audio/enemyShoot.ogg"]);
    this.load.audio("laser", ["./audio/laser.wav", "./audio/laser.ogg"]);
    this.load.audio("starSound", ["./audio/collectStar.wav", "./audio/collectStar.ogg"]);

    // Buttons, icons, and toggles
    this.load.image("title", "./images/title.png");
    this.load.image("button1", "./images/buttons/2/1.png");
    this.load.image("purpleButton", "./images/buttons/2/3.png");
    this.load.image("button2", "./images/buttons/2/5.png");
    this.load.image("toggleBack", "./images/toggles/1.png");
    this.load.image("sfxOff", "./images/icons/sfx_off.png");
    this.load.image("sfxOn", "./images/icons/sfx_on.png");
    this.load.image("musicOn", "./images/icons/music_on.png");
    this.load.image("musicOff", "./images/icons/music_off.png");

    // Ships
    this.load.image("ship", "./images/player.png");
    this.load.image("eship", "./images/eship.png");
    this.load.image("background", "./images/background.jpg");

    // Space Objects
    this.load.spritesheet("rocks", "./images/rocks.png", { frameWidth: 125, frameHeight: 100 });
    this.load.image("bullet", "./images/bullet.png");
    this.load.image("ebullet", "./images/ebullet.png");
    this.load.image("star", "./images/star.png");

    // Animation Objects
    this.load.spritesheet("exp", "./images/exp.png", { frameWidth: 64, frameHeight: 64 });
  }

  onProgress(value) {
    this.bar.setPercent(value);
    let per = Math.floor(value * 100);
    this.progText.setText(per + "%");
  }

  create() {
    this.scene.start("SceneTitle");
  }
}