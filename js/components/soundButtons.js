/**
 * File: SoundButtons.js
 * Author: Ken
 *
 * The main object that allows control over the sound in the game.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class SoundButtons extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;

    this.musicButton = new ToggleButton({
      scene: this.scene,
      key: "toggleBack",
      onIcon: "musicOn",
      offIcon: "musicOff",
      event: G.TOGGLE_MUSIC
    });

    this.sfxButton = new ToggleButton({
      scene: this.scene,
      key: "toggleBack",
      onIcon: "sfxOn",
      offIcon: "sfxOff",
      event: G.TOGGLE_SOUND
    });

    this.add(this.musicButton);
    this.add(this.sfxButton);

    this.musicButton.x = this.musicButton.width / 2;
    this.musicButton.y = this.musicButton.height / 2;

    this.sfxButton.x = game.config.width - this.sfxButton.width / 2;
    this.sfxButton.y = this.musicButton.y;

    this.sfxButton.setNoScroll();
    this.musicButton.setNoScroll();

    if (!model.musicOn) {
      this.musicButton.toggle();
    }
    if (!model.soundOn) {
      this.sfxButton.toggle();
    }

    this.scene.add.existing(this);
  }
}
