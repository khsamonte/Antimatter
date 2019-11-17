/**
 * File: LoadingScene.js
 * Author: Ken
 *
 * The first scene of the game: displays a progress bar while loading all assets.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class LoadingScene extends Phaser.Scene {
  constructor() {
    super("LoadingScene");
    this.loadingInfo = "Currently loading assets and resources. Please wait...";
    this.loadingInfoConfig = {
      color: "#eeeeee",
      fontFamily: "sans-serif",
      fontSize: game.config.width / 35
    };

    this.gameInfo = "Antimatter © 2019";
    this.subInfo = "Based on SpaceBattle at William Clarkson's Phaser 3 Course.";
  }

  preload() {
    this.uiGrid = new AlignGrid({
      scene: this, rows: 11, cols: 11
    });
    // this.uiGrid.showNumbers(); 

    // Creates an instance of the loading progress bar
    this.loadingBar = new LoadingBar({
      scene: this,
      x: game.config.width / 2,
      y: game.config.height / 2
    });

    // The percentage text displayed in the loading bar
    this.progText = this.add.text(
      game.config.width / 2,
      game.config.height / 2,
      "0%",
      {
        color: "#ffffff",
        fontFamily: "Indie Flower",
        fontSize: game.config.width / 20
      }
    );
    this.progText.setOrigin(0.5, 0.5);
    this.load.on("progress", this.onLoadingProgress, this);

    // Load the loading information
    this.loadingInfoText = this.add.text(
      0, 0, this.loadingInfo, this.loadingInfoConfig
    );
    this.loadingInfoText.setOrigin(0.5, 0.5);
    this.uiGrid.placeAtIndex(82, this.loadingInfoText);

    // Load the Game Title
    this.gameInfoText = this.add.text(
      0, 0, this.gameInfo, this.loadingInfoConfig
    );
    this.gameInfoText.setOrigin(0.5, 0.5);
    this.uiGrid.placeAtIndex(93, this.gameInfoText);

    // Load the sub info
    this.subInfoText = this.add.text(
      0, 0, this.subInfo, this.loadingInfoConfig
    );
    this.subInfoText.setOrigin(0.5, 0.5);
    this.subInfoText.x = this.gameInfoText.x;
    this.subInfoText.y = this.gameInfoText.y + 20;

    // Loads all of the audio files in the game
    this.load.audio("backgroundMusic", [
      "./audio/red-armor.mp3",
      "./audio/red-armor.ogg"
    ]);
    this.load.audio("explode", ["./audio/explode.wav", "./audio/explode.ogg"]);

    // Player Ship
    this.load.audio("laser", ["./audio/laser.wav", "./audio/laser.ogg"]);
    this.load.audio("starSound", [
      "./audio/collectStar.wav",
      "./audio/collectStar.ogg"
    ]);
    this.load.audio("battery", [
      "./audio/collectBattery.wav",
      "./audio/collectBattery.ogg"
    ]);
    this.load.audio("shield", [
      "./audio/collectShield.wav",
      "./audio/collectShield.ogg"
    ]);
    this.load.audio("turbo", ["./audio/turbo.wav", "./audio/turbo.ogg"]);

    // Mother Ship
    this.load.audio("enemyShoot", [
      "./audio/enemyShoot.wav",
      "./audio/enemyShoot.ogg"
    ]);
    this.load.audio("charging", [
      "./audio/charging.mp3",
      "./audio/charging.ogg"
    ]);

    // Space
    this.load.audio("meteor", ["./audio/meteor.wav", "./audio/meteor.ogg"]);

    // Loads the UI of the game
    this.load.image("title", "./images/antimatter.png");
    this.load.image("win", "./images/win.png");
    this.load.image("lose", "./images/lose.png");

    this.load.image("purpleButton", "./images/buttons/2/3.png");
    this.load.image("toggleBack", "./images/toggles/1.png");
    this.load.image("sfxOff", "./images/icons/sfx_off.png");
    this.load.image("sfxOn", "./images/icons/sfx_on.png");
    this.load.image("musicOn", "./images/icons/music_on.png");
    this.load.image("musicOff", "./images/icons/music_off.png");

    // Loads the background and the ships
    this.load.image("background", "./images/space-bg.jpg");
    this.load.image("ship", "./images/player.png");
    this.load.image("eship", "./images/eship.png");

    // Loads the space objects and projectiles
    this.load.spritesheet("rocks", "./images/rocks.png", {
      frameWidth: 125,
      frameHeight: 100
    });
    this.load.image("meteor", "./images/meteor.png");
    this.load.image("meteorite", "./images/meteorite.png");
    this.load.image("comet", "./images/comet.png");
    this.load.image("star", "./images/star.png");

    // Loads the technology objects
    this.load.image("bullet", "./images/bullet.png");
    this.load.image("ebullet", "./images/ebullet.png");
    this.load.image("battery", "./images/battery.png");
    this.load.image("shield", "./images/shield.png");
    this.load.image("bomb", "./images/bomb.svg");
    this.load.image("blackhole", "./images/blackhole4.png");
    this.load.image("wormhole", "./images/wormhole.png");

    // Loads the animating sprites
    this.load.spritesheet("exp", "./images/exp.png", {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  // Updates the graphics and text of the loading bar
  onLoadingProgress(value) {
    this.loadingBar.setPercentage(value);
    let per = Math.floor(value * 100);
    this.progText.setText(per + "%");
  }

  // Moves to the next scene upon loading all the images
  create() {
    this.cameras.main.fadeOut(1300);
    this.time.delayedCall(1300, this.nextScene, [], this);
  }

  nextScene() {
    this.scene.start("TitleScene");
  }
}
