/**
 * File: InfoText.js
 * Author: Ken
 *
 * The text that displays the game information on
 * how to play.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class InfoText extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;

    if (!config.width) {
      config.width = game.config.width - 50;
    }
    if (!config.height) {
      config.height = game.config.height - 50;
    }

    this.alignGrid = new AlignGrid({
      rows: 11, cols: 11, scene: this.scene
    });

    // Shaded Background
    this.infoBG = this.scene.add.graphics();
    this.infoBG.fillStyle(0x000000, 0.5);
    this.infoBG.fillRoundedRect(
      -config.width / 2,
      -config.height / 2,
      config.width,
      config.height,
      20
    );
    this.alignGrid.placeAtIndex(60, this.infoBG);
    this.add(this.infoBG);

    // Add all the elements to the scene
    this.scene.add.existing(this);
  }
}