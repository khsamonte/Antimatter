// Creating the click event
function create() {
  // Make background listen to events (to move the ship)
  this.background.setInteractive();
  this.background.on("pointerdown", this.backgroundClicked, this);
}

// The ship moves to where the mouse clicks
function backgroundClicked() {
  // Note: input.localPos are Phaser functions
  this.targetX = this.background.input.localX * this.background.scaleX;
  this.targetY = this.background.input.localY * this.background.scaleX;

  // moveTo returns an angle. The sprite's "angle" property is where it faces
  // this.physics.moveTo(sprite, destinationX, destinationY, velocity)
  let angle = this.physics.moveTo(this.ship, this.targetX, this.targetY, 100);
  angle = this.toDegrees(angle);
  this.ship.angle = angle;

  // Rest of the code below is for the enemy ship chasing the player ship:

  // Gets the ship's distance from the target click
  let shipDistX = Math.abs(this.ship.x - this.targetX);
  let shipDistY = Math.abs(this.ship.y - this.targetY);

  // The ship will only chase you if you moved a distance > 30
  if (shipDistX > 30 && shipDistY > 30) {
    let speed = 50;

    if (this.enemyHP < this.totalEnemyLife / 2) {
      speed = 75;
    }

    if (this.enemyHP < this.totalEnemyLife / 4) {
      speed = 99;
    }

    // Enemy ship movement
    let enemyAngle = this.physics.moveTo(
      this.eship,
      this.ship.x,
      this.ship.y,
      speed
    );
    enemyAngle = this.toDegrees(enemyAngle);
    this.eship.angle = enemyAngle;
  }
}
