/**
 * File: SceneOver.js
 * Author: Ken
 *
 * The game over scene of the game when the main scene ends.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  preload() {
    this.cameras.main.fadeIn(500);
  }

  create() {
    // Sets the background of the Game Over scene
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);

    // Creates a canvas grid to facilitate positioning of objects
    this.alignGrid = new AlignGrid({
      rows: 11,
      cols: 11,
      scene: this
    });

    // The text displayed declaring whether the player won or lost
    // this.winnerText = this.add.text(
    //   0,
    //   0,
    //   model.playerWon ? "YOU WIN" : "YOU LOSE",
    //   {
    //     fontSize: game.config.width / 10,
    //     color: model.playerWon ? "#3fe213" : "#e50000",
    //     fontFamily: "Varela Round"
    //   }
    // );
    // this.winnerText.setOrigin(0.5, 0.5);
    // this.alignGrid.placeAtIndex(38, this.winnerText);

    // Displays the ship sprite of the winner
    if (model.playerWon) {
      this.winnerText = this.add.image(0, 0, 'win');
      this.winner = this.add.image(0, 0, 'ship');
    } else {
      this.winnerText = this.add.image(0, 0, 'lose');
      this.winner = this.add.image(0, 0, 'eship');
    }
    Align.scaleToGameWidth(this.winner, 0.25);
    this.winner.angle = 270;
    this.winnerText.setOrigin(0.5, 0.5);
    this.alignGrid.placeAtIndex(60, this.winner);
    this.alignGrid.placeAtIndex(38, this.winnerText);

    // Displays the start button once again if user wishes to restart
    const startButton = new FlatButton({
      scene: this,
      text: 'Main Menu',
      event: 'start_game',
      textConfig: {
        fontFamily: 'Varela Round',
        fontSize: 16
      }
    });
    this.alignGrid.placeAtIndex(93, startButton);

    // Runs the function when the event is triggered from the startButton
    emitter.on('start_game', this.startGame, this);

    // const sb = new SoundButtons({ scene: this });
  }

  startGame() {
    this.scene.start('TitleScene');
  }
}
