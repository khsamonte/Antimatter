/**
 * File: ToggleButton.js
 * Author: Ken
 *
 * The generic button that allows toggle functionality.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class ToggleButton extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;

    this.background = this.scene.add.image(0, 0, config.key);
    this.onIcon = this.scene.add.image(0, 0, config.onIcon);
    this.offIcon = this.scene.add.image(0, 0, config.offIcon);

    Align.scaleToGameWidth(this.background, 0.1);
    Align.scaleToGameWidth(this.onIcon, 0.05);
    Align.scaleToGameWidth(this.offIcon, 0.05);

    this.add(this.background);
    this.add(this.onIcon);
    this.add(this.offIcon);

    if (!config.value) {
      config.value = true;
    }
    this.value = config.value;

    if (config.event) {
      this.event = config.event;
    }

    this.setIcons();

    this.background.setInteractive();
    this.background.on("pointerdown", this.toggle, this);

    if (config.x) {
      this.x = config.x;
    }
    if (config.y) {
      this.y = config.y;
    }

    this.setSize(this.background.displayWidth, this.background.displayHeight);
    this.scene.add.existing(this);
  }

  setNoScroll() {
    this.background.setScrollFactor(0);
    this.onIcon.setScrollFactor(0);
    this.offIcon.setScrollFactor(0);
  }

  toggle() {
    this.value = !this.value;
    this.setIcons();
    if (this.event) {
      emitter.emit(this.event, this.value);
    }
  }

  setIcons() {
    if (this.value) {
      this.onIcon.visible = true;
      this.offIcon.visible = false;
    } else {
      this.onIcon.visible = false;
      this.offIcon.visible = true;
    }
  }
}
