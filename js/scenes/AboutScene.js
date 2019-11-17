/**
 * File: AboutScene.js
 * Author: Ken
 *
 * Displays the About Me content.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class AboutScene extends Phaser.Scene {
  constructor() {
    super("AboutScene");

    this.infoWidth = game.config.width - 50;
    this.infoHeight = game.config.height - 50;

    this.aboutInfoTxt = "Antimatter is a 2D space-themed shootout game loosely based on Space Impact.\n\nThis mini-project is primarily developed by Ken Samonte using PhaserJS.\n\nThe prototype used for this game is from the SpaceBattle mini-game taught by William Clarkson on his Phaser Udemy course, entirely refurbished and reupholstered.\n\nCredits (so far):";

    this.creditsInfo = "Developer:\nDesigner:\nQA:\n\n\nMusic:\n";

    this.authorsInfo = "Ken Samonte\nRalph Montevirgen\nSanjo Española\nNomar Imperio\nRalph Montevirgen\nThe Man in Red Armor\n(Tales of Legendia)";

    this.textConfig = {
      color: "#eeeeee",
      fontFamily: "sans-serif",
      fontSize: game.config.width / 35,
      wordWrap: {
        width: this.infoWidth - 75
      },
      lineSpacing: 20
    }

    this.creditsTextConfig = {
      color: "#ffff99",
      fontFamily: "Varela Round",
      fontSize: game.config.width / 35
    }

    this.authorsTextConfig = {
      color: "#eeeeee",
      fontFamily: "Varela Round",
      fontSize: game.config.width / 35
    }
  }

  create() {
    // Setup
    emitter = new Phaser.Events.EventEmitter();
    controller = new Controller();

    this.alignGrid = new AlignGrid({
      rows: 11, cols: 11, scene: this.scene
    });

    this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

    this.infoText = new InfoText({
      scene: this
    });

    // Game Info Summary
    this.aboutInfo = this.add.text(
      0, 0, this.aboutInfoTxt, this.textConfig
    );
    this.alignGrid.placeAtIndex(12, this.aboutInfo);
    this.aboutInfo.setOrigin(0, 0.2);

    // Credit Text
    this.creditsText = this.add.text(
      0,
      0,
      this.creditsInfo,
      this.creditsTextConfig
    );
    this.creditsText.setOrigin(0.5, 0.2);
    this.alignGrid.placeAtIndex(57, this.creditsText);

    // Author Text
    this.authorsText = this.add.text(
      0,
      0,
      this.authorsInfo,
      this.authorsTextConfig
    );
    this.authorsText.setOrigin(0.5, 0.2);
    this.alignGrid.placeAtIndex(61, this.authorsText);

    // Creates the start button
    const goBackButton = new FlatButton({
      scene: this,
      text: "Go Back",
      event: "go_back",
      textConfig: {
        fontFamily: "Varela Round",
        fontSize: 20
      }
    });

    this.alignGrid.placeAtIndex(104, goBackButton);

    // Runs the function when the event is triggered from the startButton
    emitter.on("go_back", this.goBack, this);
  }

  goBack() {
    this.scene.start("TitleScene");
  }
}