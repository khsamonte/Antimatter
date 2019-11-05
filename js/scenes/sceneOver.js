class SceneOver extends Phaser.Scene {
  constructor() {
    super("SceneOver");
  }
  preload() {
    this.load.image("button1", "./images/buttons/2/1.png");
  }
  create() {
    this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

    // Grid
    this.alignGrid = new AlignGrid({ rows: 11, cols: 11, scene: this });
    // this.alignGrid.showNumbers();

    this.winnerText = this.add.text(0, 0, "WINNER",
      { fontSize: game.config.width / 10, color: "#3fe213" }
    );
    this.winnerText.setOrigin(0.5, 0.5);
    this.alignGrid.placeAtIndex(38, this.winnerText);

    if (model.playerWon) {
      this.winner = this.add.image(0, 0, "ship");
    } else {
      this.winner = this.add.image(0, 0, "eship");
    }
    Align.scaleToGameWidth(this.winner, 0.25);
    this.winner.angle = 270;
    this.alignGrid.placeAtIndex(60, this.winner);


    // Start Button
    const buttonStart = new FlatButton({
      scene: this,
      key: "button1",
      text: "Play Again!",
      event: "start_game",
    });
    this.alignGrid.placeAtIndex(93, buttonStart);

    emitter.on("start_game", this.startGame, this);

    // const sb = new SoundButtons({ scene: this });
  }
  startGame() {
    this.scene.start("SceneMain");
  }
  update() {

  }
}