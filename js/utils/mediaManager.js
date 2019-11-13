class MediaManager {
  constructor(config) {
    this.scene = config.scene;

    // Listeners
    emitter.on(G.PLAY_SOUND, this.playSound, this);
    emitter.on(G.PLAY_STAR_SOUND, this.playStarSound, this);
    emitter.on(G.PLAY_BATTERY_SOUND, this.playBatterySound, this);
    emitter.on(G.PLAY_SHIELD_SOUND, this.playShieldSound, this);
    emitter.on(G.PLAY_TURBO_SOUND, this.playTurboSound, this);
    emitter.on(G.PLAY_CHARGING_SOUND, this.playChargingSound, this);
    emitter.on(G.PLAY_METEOR_SOUND, this.playMeteorSound, this);
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

  playBatterySound(key) {
    if (model.soundOn) {
      const sound = this.scene.sound.add(key, { volume: 0.5 });
      sound.play();
    }
  }

  playShieldSound(key) {
    if (model.soundOn) {
      const sound = this.scene.sound.add(key, { volume: 0.4 });
      sound.play();
    }
  }

  playTurboSound(key) {
    if (model.soundOn) {
      const sound = this.scene.sound.add(key, { volume: 1 });
      sound.play();
    }
  }

  playChargingSound(key) {
    if (model.soundOn) {
      const sound = this.scene.sound.add(key, { volume: 0.5 });
      sound.play();
    }
  }

  playMeteorSound(key) {
    if (model.soundOn) {
      const sound = this.scene.sound.add(key, { volume: 0.2 });
      sound.play();
    }
  }

  setBackgroundMusic(key) {
    if (model.musicOn) {
      this.background = this.scene.sound.add(key, { volume: 0.7, loop: true });
      this.background.play();
    }
  }
}
