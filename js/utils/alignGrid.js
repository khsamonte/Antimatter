/*
 * File: alignGrid.js
 *
 * This will serve as the alignment for the container
 */

class AlignGrid {
  constructor(config) {
    this.config = config;  // Make a reference to the config

    if (!config.scene) {
      console.log("Missing scene");
      return;
    }
    if (!config.rows) {
      config.rows = 5;
    }
    if (!config.cols) {
      config.cols = 5;
    }
    if (!config.height) {
      config.height = game.config.height;
    }
    if (!config.width) {
      config.width = game.config.width;
    }

    // Reference to the scene within the class
    this.scene = config.scene;

    // Cell width and cell height
    this.cw = config.width / config.cols;
    this.ch = config.height / config.rows;
  }

  show() {
    this.graphics = this.scene.add.graphics();  // Will give us an obj to draw on
    this.graphics.lineStyle(2, 0xff0000);

    // Columns
    for (let i = 0; i < this.config.width; i += this.cw) {
      this.graphics.moveTo(i, 0);
      this.graphics.lineTo(i, this.config.height);
    }

    // Rows
    for (let i = 0; i < this.config.height; i += this.ch) {
      this.graphics.moveTo(0, i);
      this.graphics.lineTo(this.config.width, i);
    }

    this.graphics.strokePath();
  }

  placeAt(xx, yy, obj) {
    // Calc position based upon the cw and ch
    const x2 = this.cw * xx + (this.cw / 2);
    const y2 = this.ch * yy + (this.ch / 2);

    obj.x = x2;
    obj.y = y2;
  }

  placeAtIndex(index, obj) {
    var yy = Math.floor(index / this.config.cols);
    var xx = index - (yy * this.config.cols);

    this.placeAt(xx, yy, obj);
  }

  showNumbers() {
    this.show();

    let count = 0;
    for (let i = 0; i < this.config.rows; i++) {
      for (let j = 0; j < this.config.cols; j++) {
        const numText = this.scene.add.text(0, 0, count, { color: "#ff0000" });
        numText.setOrigin(0.5, 0.5);
        this.placeAtIndex(count, numText);
        count++;
      }
    }
  }
}