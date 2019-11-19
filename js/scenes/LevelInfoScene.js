/**
 * File: SceneOver.js
 * Author: Ken
 *
 * The game over scene of the game when the main scene ends.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class LevelInfoScene extends Phaser.Scene {
  constructor() {
    super('LevelInfoScene');

    model.level = 1;
  }

  preload() {
    this.cameras.main.fadeIn(500);
  }

  create() {
    // Sets the background of the Game Over scene
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);

    // Creates a canvas grid to facilitate positioning of objects
    this.alignGrid = new AlignGrid({
      rows: 11,
      cols: 11,
      scene: this
    });

    // The text displayed declaring whether the player won or lost
    this.levelText = this.add.text(0, 0, 'Level ' + model.level, {
      fontSize: game.config.width / 15,
      color: '#9775ba',
      fontFamily: 'Varela Round'
    });
    this.levelText.setOrigin(0.5, 0.5);
    this.alignGrid.placeAtIndex(60, this.levelText);

    this.time.delayedCall(2000, this.fadeOut, [], this);

    // const sb = new SoundButtons({ scene: this });
  }

  fadeOut() {
    this.cameras.main.fadeOut(500);
    this.time.delayedCall(500, this.startGame, [], this);
  }

  startGame() {
    this.scene.start('MainScene');
  }
}
