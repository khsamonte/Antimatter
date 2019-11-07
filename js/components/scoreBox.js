/**
 * File: ScoreBox.js
 * Author: Ken
 *
 * Might be of actual use later if we decide to recreate the score boxes
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class ScoreBox extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;

    // Adds the text that contains the score
    this.text1 = this.scene.add.text(0, 0, "SCORE: 0");
    this.text1.setOrigin(0.5, 0.5);
    this.add(this.text1);

    // Positions the text depending on the configuration
    if (config.x) {
      this.x = config.x;
    }
    if (config.y) {
      this.y = config.y;
    }
    this.text1.setBackgroundColor("#000000");

    this.scene.add.existing(this);
    emitter.on(G.SCORE_UPDATED, this.scoreUpdated, this);
  }

  scoreUpdated() {
    this.text1.setText("SCORE: " + model.score);
  }
}
