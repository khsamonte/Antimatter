/**
 * File: TitleScene.js
 * Author: Ken
 *
 * The title screen / menu of the game.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');

    this.creditsInfo = 'Created by: Ken Samonte & Ralph Montevirgen © 2019';
    this.creditsInfoConfig = {
      color: '#9775ba',
      fontFamily: 'Varela Round',
      fontSize: game.config.width / 35
    };
  }

  preload() {
    this.cameras.main.fadeIn(500);
  }

  create() {
    // Setup
    emitter = new Phaser.Events.EventEmitter();
    controller = new Controller();

    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);

    // Sets the background music
    const mediaManager = new MediaManager({ scene: this });

    if (model.bgMusic === '') {
      model.bgMusic = 'red armor';
      mediaManager.setBackgroundMusic('backgroundMusic');
    }

    // Creates a canvas grid to facilitate positioning of objects
    const gridConfig = { rows: 11, cols: 11, scene: this };
    this.alignGrid = new AlignGrid(gridConfig);

    // Adds meteors to the screen
    this.meteorShower();
    this.meteorGroup = this.physics.add.group({});

    // Adds the title to the screen
    const title = this.add.image(0, 0, 'title');
    Align.scaleToGameWidth(title, 0.9);
    this.alignGrid.placeAtIndex(16, title);

    // Load the credits
    this.credits = this.add.text(
      0,
      0,
      this.creditsInfo,
      this.creditsInfoConfig
    );
    this.credits.setOrigin(0.5, 0.5);
    this.alignGrid.placeAtIndex(27, this.credits);

    // Displays a static sprite of the player's ship
    const staticShip = this.add.image(0, 0, 'ship');
    this.alignGrid.placeAtIndex(60, staticShip);
    Align.scaleToGameWidth(staticShip, 0.125);

    // Creates the start button
    const startButton = new FlatButton({
      scene: this,
      text: 'Start Game',
      event: 'start_game',
      textConfig: {
        fontFamily: 'Varela Round',
        fontSize: 16
      }
    });
    this.alignGrid.placeAtIndex(82, startButton);

    // Creates the start button
    const controlsButton = new FlatButton({
      scene: this,
      text: 'How To Play',
      event: 'game_controls',
      textConfig: {
        fontFamily: 'Varela Round',
        fontSize: 16
      }
    });
    this.alignGrid.placeAtIndex(93, controlsButton);

    // Creates the start button
    const aboutButton = new FlatButton({
      scene: this,
      text: 'About',
      event: 'about_us',
      textConfig: {
        fontFamily: 'Varela Round',
        fontSize: 16
      }
    });
    this.alignGrid.placeAtIndex(104, aboutButton);

    // Runs the function when the event is triggered from the startButton
    emitter.on('start_game', this.fadeOut, this);
    emitter.on('game_controls', this.viewControllers, this);
    emitter.on('about_us', this.viewAbout, this);

    // const sb = new SoundButtons({ scene: this });
  }

  // Generate a succession of 35 meteors with .4s arrival difference
  meteorShower() {
    // Callback
    for (let i = 0; i < 500; i++) {
      this.time.delayedCall(i * 2000, this.spawnMeteor, [], this);
    }
  }

  // Create one meteor
  spawnMeteor() {
    // All meteors will arrive from the right, going to the left
    const xx = Math.floor(game.config.width);
    const yy = Math.floor(Math.random() * game.config.height);

    // Add the sprite
    const meteor = this.physics.add.sprite(xx, yy, 'meteor');
    Align.scaleToGameWidth(meteor, 0.2);
    this.meteorGroup.add(meteor);

    // Set the interaction collision of the meteor
    meteor.body.setVelocity(-230, Math.random() * 100);
    meteor.angle = 135;
    meteor.body.angularVelocity = 1;
    meteor.body.collideWorldBounds = false;
  }

  fadeOut() {
    this.cameras.main.fadeOut(500);
    this.time.delayedCall(500, this.startGame, [], this);
  }

  startGame() {
    this.scene.start('LevelInfoScene');
  }

  viewControllers() {
    this.scene.start('HowToScene');
  }

  viewAbout() {
    this.scene.start('AboutScene');
  }
}
