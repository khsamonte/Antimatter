/**
 * File: Bar.js
 * Author: Ken
 *
 * The component of the loading progress bar.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class Bar extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;

    // The colour of the loading progress bar
    if (!config.color) {
      config.color = 0x009900;
    }

    // The width and height of the loading bar
    if (!config.width) {
      config.width = 200;
    }
    if (!config.height) {
      config.height = config.width / 4;
    }

    // Adding the loading graphics to the scene
    this.graphics = this.scene.add.graphics();
    this.graphics.fillStyle(config.color, 1);
    this.graphics.fillRect(0, 0, config.width, config.height);
    this.add(this.graphics);

    // Positioning the graphics and component in the middle
    this.graphics.x = -config.width / 2;
    this.graphics.y = -config.height / 2;
    if (config.x) {
      this.x = config.x;
    }
    if (config.y) {
      this.y = config.y;
    }

    // Add the component to the scene
    this.scene.add.existing(this);
  }

  // Scaling the progress bar
  setPercent(per) {
    this.graphics.scaleX = per;
  }
}
