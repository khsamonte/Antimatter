class SceneTitle extends Phaser.Scene {
  constructor() {
    super("SceneTitle");
  }
  preload() {
  }
  create() {
    // Setup
    emitter = new Phaser.Events.EventEmitter();
    controller = new Controller();
    this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

    // Background Music
    const mediaManager = new MediaManager({ scene: this });
    mediaManager.setBackgroundMusic("backgroundMusic");

    // Grid
    const gridConfig = { rows: 11, cols: 11, scene: this };
    this.alignGrid = new AlignGrid(gridConfig);

    // Title Image
    const title = this.add.image(0, 0, "title");
    Align.scaleToGameWidth(title, 0.8);
    this.alignGrid.placeAtIndex(27, title);

    // Display Ship
    const ship = this.add.image(0, 0, "ship");
    this.alignGrid.placeAtIndex(60, ship);
    Align.scaleToGameWidth(ship, 0.125);

    // Start Button
    const buttonStart = new FlatButton({
      scene: this,
      key: "purpleButton",
      text: "START",
      event: "start_game",
      textConfig: {
        fontFamily: "Varela Round",
        fontSize: 24
      }
    });
    this.alignGrid.placeAtIndex(93, buttonStart);

    // Listener of the "start_game" event
    emitter.on("start_game", this.startGame, this);

    // const mediaManager = new MediaManager({ scene: this });
    // mediaManager.setBackgroundMusic("backgroundMusic");

    // const sb = new SoundButtons({ scene: this });
  }
  startGame() {
    this.scene.start("SceneMain");
  }
}