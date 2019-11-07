/**
 * File: Controller.js
 * Author: Ken
 *
 * Allows control over the game elements.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class Controller {
  constructor() {
    emitter.on(G.SET_SCORE, this.setScore);
    emitter.on(G.UP_POINTS, this.upPoints);
    emitter.on(G.TOGGLE_SOUND, this.toggleSound);
    emitter.on(G.TOGGLE_MUSIC, this.toggleMusic);
  }

  // For toggling the sfxButtons
  toggleSound(val) {
    model.soundOn = val;
  }
  toggleMusic(val) {
    model.musicOn = val;
  }

  // Not sure if these are still needed
  setScore(score) {
    model.score = score;
  }
  upPoints(points) {
    let score = model.score;
    score += points;
    model.score = score;
  }
}
