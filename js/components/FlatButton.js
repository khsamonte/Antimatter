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
    if (!config.scene) {
      console.log("Missing scene!");
      return;
    }
    if (!config.key) {
      console.log("Missing key!");
      return;
    }
    super(config.scene);

    this.config = config;
    this.scene = config.scene;
    this.background = this.scene.add.image(0, 0, config.key);
    this.add(this.background);

    // Add text to button
    if (config.text) {
      if (config.textConfig) {
        this.text1 = this.scene.add.text(0, 0, config.text, config.textConfig);
      } else {
        this.text1 = this.scene.add.text(0, 0, config.text);
      }
      this.text1.setOrigin(0.5, 0.5);
      this.add(this.text1);
    }

    this.scene.add.existing(this);

    // Add event
    if (config.event) {
      this.background.setInteractive();
      this.background.on("pointerdown", this.pressed, this);
    }

    // Check mobile
    if (model.isMobile === -1) {
      this.background.on("pointerover", this.over, this);
      this.background.on("pointerout", this.out, this);
    }
  }

  over() {
    this.y -= 5;
  }

  out() {
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