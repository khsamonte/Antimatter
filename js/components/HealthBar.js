/**
 * File: HealhBar.js
 * Author: Ken
 *
 * The component of the loading progress bar.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class HealthBar extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;

    // The colour
    if (!config.color) {
      config.color = 0x009900;
    }

    // The width and height of the loading bar
    if (!config.width) {
      config.width = 70;
    }
    if (!config.height) {
      config.height = 7;
    }

    // Adding the loading graphics to the scene
    this.space = this.scene.add.graphics();
    this.space.fillStyle(0x000000, 1);
    this.space.fillRect(0, 0, config.width, config.height);
    this.add(this.space);

    this.health = this.scene.add.graphics();
    this.health.fillStyle(config.color, 1);
    this.health.fillRect(0, 0, config.width, config.height);
    this.add(this.health);

    // Positioning the graphics and component in the middle
    // this.health.x = -config.width / 2;
    // this.health.y = -config.height / 2;
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
  // setPercent(per) {
  //   this.health.scaleX = per;
  // }

  // setLife(per) {
  //   this.health.fillRect(0, 0, per * 0.7, 7);
  // }
}
