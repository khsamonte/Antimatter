/**
 * File: LoadingBar.js
 * Author: Ken
 *
 * The newly updated component of the loading progress bar.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class LoadingBar extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;

    config.borderColor = 0x53198c;
    config.borderWidth = 260;
    config.borderHeight = 50;
    config.color = 0x53198c;
    config.width = 250;
    config.height = 40;

    // Adding the loading border
    this.border = this.scene.add.graphics();
    this.border.lineStyle(3, config.borderColor, 1);
    this.border.strokeRoundedRect(
      0, 0, config.borderWidth, config.borderHeight, 20
    );
    this.add(this.border);

    // Adding the loading progress
    this.progressBar = this.scene.add.graphics();
    this.progressBar.fillStyle(config.color, 1);
    this.progressBar.fillRoundedRect(
      0, 0, config.width, config.height, 15
    );
    this.add(this.progressBar);

    // Positioning the bars in the middle
    this.border.x = config.borderWidth / -2;
    this.border.y = config.borderHeight / -2;
    this.progressBar.x = this.border.x + 5;
    this.progressBar.y = this.border.y + 5;

    this.x = config.x;
    this.y = config.y;

    // Add this to the scene
    this.scene.add.existing(this);
  }

  setPercentage(per) {
    this.progressBar.scaleX = per;
  }
}