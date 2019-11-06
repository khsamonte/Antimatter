class MediaManager {
  constructor(config) {
    this.scene = config.scene;

    // Listeners
    emitter.on(G.PLAY_SOUND, this.playSound, this);
    emitter.on(G.PLAY_STAR_SOUND, this.playStarSound, this);
    emitter.on(G.MUSIC_CHANGED, this.musicChanged, this);
  }

  musicChanged() {
    if (this.background) {
      if (!model.musicOn) {
        this.background.stop();
      } else {
        this.background.play();
      }
    }
  }

  playSound(key) {
    if (model.soundOn) {
      const sound = this.scene.sound.add(key, { volume: 0.4 });
      sound.play();
    }
  }

  playStarSound(key) {
    if (model.soundOn) {
      const sound = this.scene.sound.add(key, { volume: 1 });
      sound.play();
    }
  }

  setBackgroundMusic(key) {
    if (model.musicOn) {
      this.background = this.scene.sound.add(key, { volume: 0.8, loop: true });
      this.background.play();
    }
  }
}