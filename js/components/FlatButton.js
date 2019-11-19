/**
 * File: FlatButton.js
 * Author: Ken
 *
 * The button used in the Title and GameOver screens.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class FlatButton extends Phaser.GameObjects.Container {
  constructor(config) {
    // Requires a key and scene config
    if (!config.scene) {
      console.log('Missing scene!');
      return;
    }
    // if (!config.key) {
    //   console.log("Missing key!");
    //   return;
    // }
    super(config.scene);

    this.config = config;
    this.scene = config.scene;
    // this.background = this.scene.add.image(0, 0, config.key);
    // this.add(this.background);

    config.borderColor = 0x642f97;
    config.borderWidth = 185;
    config.borderHeight = 45;
    config.color = 0x642f97;
    config.width = 180;
    config.height = 53;

    this.button = this.scene.add.image(0, 0, 'button');
    this.button.setOrigin(0, 0);
    this.button.scaleX = 0.85;
    this.button.scaleY = this.button.scaleX;
    this.add(this.button);
    this.button.x = -config.width / 2;
    this.button.y = -config.height / 2;

    // this.border = this.scene.add.graphics();
    // this.border.lineStyle(2, config.borderColor, 1);
    // this.border.strokeRoundedRect(
    //   -config.borderWidth / 2,
    //   -config.borderHeight / 2,
    //   config.borderWidth,
    //   config.borderHeight,
    //   17
    // );
    // this.add(this.border);

    // this.button = this.scene.add.graphics();
    // this.button.fillStyle(config.color, 1);
    // this.button.fillRoundedRect(
    //   -config.width / 2,
    //   -config.height / 2,
    //   config.width,
    //   config.height,
    //   15
    // );
    // this.add(this.button);

    // Add text to button
    if (config.text) {
      if (config.textConfig) {
        this.text1 = this.scene.add.text(0, 0, config.text, config.textConfig);
      } else {
        this.text1 = this.scene.add.text(10, 10, config.text);
      }
      this.text1.setOrigin(0.5, 0.5);
      this.add(this.text1);
    }

    this.scene.add.existing(this);

    // Add event
    if (config.event) {
      this.button.setInteractive();
      this.button.on('pointerdown', this.pressed, this);
    }

    // Check mobile
    if (model.isMobile === -1) {
      this.button.on('pointerover', this.over, this);
      this.button.on('pointerout', this.out, this);
    }
  }

  over() {
    this.border.lineStyle(2, 0x865eae, 1);
    this.button.fillStyle(0x865eae, 1);
    this.y -= 5;
  }

  out() {
    this.border.lineStyle(2, 0x642f97, 1);
    this.button.fillStyle(0x642f97, 1);
    this.y += 5;
  }

  pressed() {
    if (this.config.params) {
      emitter.emit(this.config.event, this.config.params);
    } else {
      emitter.emit(this.config.event);
    }
  }
}
