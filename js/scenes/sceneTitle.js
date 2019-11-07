/**
 * File: SceneTitle.js
 * Author: Ken
 *
 * The title screen / menu of the game.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class SceneTitle extends Phaser.Scene {
  constructor() {
    super("SceneTitle");
  }

  create() {
    // Setup
    emitter = new Phaser.Events.EventEmitter();
    controller = new Controller();
    this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

    // Sets the background music
    const mediaManager = new MediaManager({ scene: this });
    mediaManager.setBackgroundMusic("backgroundMusic");

    // Creates a canvas grid to facilitate positioning of objects
    const gridConfig = { rows: 11, cols: 11, scene: this };
    this.alignGrid = new AlignGrid(gridConfig);

    // Adds the title to the screen
    const title = this.add.image(0, 0, "title");
    Align.scaleToGameWidth(title, 0.8);
    this.alignGrid.placeAtIndex(27, title);

    // Displays a static sprite of the player's ship
    const staticShip = this.add.image(0, 0, "ship");
    this.alignGrid.placeAtIndex(60, ship);
    Align.scaleToGameWidth(staticShip, 0.125);

    // Creates the start button
    const startButton = new FlatButton({
      scene: this,
      key: "purpleButton",
      text: "START",
      event: "start_game",
      textConfig: {
        fontFamily: "Varela Round",
        fontSize: 24
      }
    });
    this.alignGrid.placeAtIndex(93, startButton);

    // Runs the function when the event is triggered from the startButton
    emitter.on("start_game", this.startGame, this);

    // const sb = new SoundButtons({ scene: this });
  }
  startGame() {
    this.scene.start("SceneMain");
  }
}
