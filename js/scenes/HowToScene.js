/**
 * File: HowToScene.js
 * Author: Ken
 *
 * The controller scene of the game.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class HowToScene extends Phaser.Scene {
  constructor() {
    super('HowToScene');

    this.infoWidth = game.config.width - 50;
    this.infoHeight = game.config.height - 50;

    this.gameInfoTxt =
      'The objective of the game is to destroy the Mothership and (in the near future) beat all 10 levels.';

    this.controlInfoTxt =
      'Movement:\nShoot Lasers:\nUse Turbo:\nWear Shield:\nDrop Bomb:\nHeatseeker:\nAntimatter:';

    this.controlKeysTxt =
      'Arrow Keys\nC\nZ\nS\t\t(unavailable yet)\nX\t\t(unavailable yet)\nV\t\t(unavailable yet)\nA\t\t(unavailable yet)';

    this.spaceObjectsInfoTxt =
      'Stars:\nBatteries:\nShields:\n\nAsteroids:\nMeteors:\nBlack Holes:\nWormholes:';

    this.descriptionsInfoTxt =
      'Heals 2 HP\n+100 mvt for 2 secs\nInvulnerability for 10 secs\n\nDeals 1 dmg (all ships)\nDeals 1 dmg (your ship)\n-50% mvt (and eats all objects)\nTeleports ship to a random location';

    this.textConfig = {
      color: '#eeeeee',
      fontFamily: 'sans-serif',
      fontSize: 15,
      wordWrap: {
        width: this.infoWidth - 75
      },
      lineSpacing: 20
    };

    this.controlTextConfig = {
      color: '#cbbadc',
      fontFamily: 'sans-serif',
      fontSize: 15
    };

    this.mechanicTextConfig = {
      color: '#ffff99',
      fontFamily: 'sans-serif',
      fontSize: 15
    };

    this.descriptionTextConfig = {
      color: '#eeeeee',
      fontFamily: 'sans-serif',
      fontSize: 15
    };
  }

  create() {
    // Setup
    emitter = new Phaser.Events.EventEmitter();
    controller = new Controller();

    this.alignGrid = new AlignGrid({
      rows: 11,
      cols: 11,
      scene: this.scene
    });

    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);

    this.infoText = new InfoText({
      scene: this
    });

    // Game Info Summary
    this.gameInfo = this.add.text(0, 0, this.gameInfoTxt, this.textConfig);
    this.alignGrid.placeAtIndex(12, this.gameInfo);
    this.gameInfo.setOrigin(0, 0.3);

    // Controls Text
    this.controlText = this.add.text(
      0,
      0,
      this.controlInfoTxt,
      this.controlTextConfig
    );
    this.controlText.setOrigin(0.5, 0);
    this.alignGrid.placeAtIndex(25, this.controlText);

    // Keys Text
    this.keysText = this.add.text(
      0,
      0,
      this.controlKeysTxt,
      this.controlTextConfig
    );
    this.keysText.setOrigin(0.5, 0);
    this.alignGrid.placeAtIndex(28, this.keysText);

    // Mechanics
    this.mechanicsText = this.add.text(
      0,
      0,
      'Objects / Space Objects:',
      this.textConfig
    );
    this.mechanicsText.setOrigin(0, 1);
    this.alignGrid.placeAtIndex(56, this.mechanicsText);

    // Space Objects Text
    this.spaceObjectsText = this.add.text(
      0,
      0,
      this.spaceObjectsInfoTxt,
      this.mechanicTextConfig
    );
    this.spaceObjectsText.setOrigin(0.5, 0.2);
    this.alignGrid.placeAtIndex(68, this.spaceObjectsText);

    // Description Text
    this.descriptionsText = this.add.text(
      0,
      0,
      this.descriptionsInfoTxt,
      this.descriptionTextConfig
    );
    this.descriptionsText.setOrigin(0.5, 0.2);
    this.alignGrid.placeAtIndex(72, this.descriptionsText);

    // Creates the start button
    const goBackButton = new FlatButton({
      scene: this,
      text: 'Go Back',
      event: 'go_back',
      textConfig: {
        fontFamily: 'Varela Round',
        fontSize: 16
      }
    });

    this.alignGrid.placeAtIndex(104, goBackButton);

    // Runs the function when the event is triggered from the startButton
    emitter.on('go_back', this.goBack, this);
  }

  goBack() {
    this.scene.start('TitleScene');
  }
}
