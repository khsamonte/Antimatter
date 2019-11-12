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
    // Creates an instance of the loading progress bar
    this.bar = new Bar({
      scene: this,
      x: game.config.width / 2,
      y: game.config.height / 2
    });
    this.bar.setPercent(0.5);

    // The percentage text displayed in the loading bar
    this.progText = this.add.text(
      game.config.width / 2,
      game.config.height / 2,
      "0%",
      {
        color: "#ffffff",
        fontFamily: "Varela Round",
        fontSize: game.config.width / 20
      }
    );
    this.progText.setOrigin(0.5, 0.5);
    this.load.on("progress", this.onLoadingProgress, this);

    // Loads all of the audio files in the game
    this.load.audio("backgroundMusic", [
      "./audio/red-armor.mp3",
      "./audio/red-armor.ogg"
    ]);
    this.load.audio("explode", ["./audio/explode.wav", "./audio/explode.ogg"]);
    this.load.audio("enemyShoot", [
      "./audio/enemyShoot.wav",
      "./audio/enemyShoot.ogg"
    ]);
    this.load.audio("laser", ["./audio/laser.wav", "./audio/laser.ogg"]);
    this.load.audio("starSound", [
      "./audio/collectStar.wav",
      "./audio/collectStar.ogg"
    ]);

    // Loads the UI of the game
    this.load.image("title", "./images/title.png");
    this.load.image("purpleButton", "./images/buttons/2/3.png");
    this.load.image("toggleBack", "./images/toggles/1.png");
    this.load.image("sfxOff", "./images/icons/sfx_off.png");
    this.load.image("sfxOn", "./images/icons/sfx_on.png");
    this.load.image("musicOn", "./images/icons/music_on.png");
    this.load.image("musicOff", "./images/icons/music_off.png");

    // Loads the background and the ships
    this.load.image("background", "./images/background.jpg");
    this.load.image("ship", "./images/player.png");
    this.load.image("eship", "./images/eship.png");

    // Loads the space objects and projectiles
    this.load.spritesheet("rocks", "./images/rocks.png", {
      frameWidth: 125,
      frameHeight: 100
    });
    this.load.image("meteor", "./images/meteorite.png");
    this.load.image("star", "./images/star.png");

    // Loads the technology objects
    this.load.image("bullet", "./images/bullet.png");
    this.load.image("ebullet", "./images/ebullet.png");
    this.load.image("battery", "./images/battery.png");
    this.load.image("shield", "./images/shield.png");
    this.load.image("bomb", "./images/bomb.svg");
    this.load.image("blackhole", "./images/black-hole.png");

    // Loads the animating sprites
    this.load.spritesheet("exp", "./images/exp.png", {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  // Updates the graphics and text of the loading bar
  onLoadingProgress(value) {
    this.bar.setPercent(value);
    let per = Math.floor(value * 100);
    this.progText.setText(per + "%");
  }

  // Moves to the next scene upon loading all the images
  create() {
    this.scene.start("SceneTitle");
  }
}
