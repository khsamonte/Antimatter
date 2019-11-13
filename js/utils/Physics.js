// A class with static methods

class Physics {
  static createMovingObject(obj, speedLimit) {
    const xx = Math.floor(Math.random() * this.background.displayWidth);
    const yy = Math.floor(Math.random() * this.background.displayHeight);

    let vx = Math.floor(Math.random() * 2) - 1;
    let vy = Math.floor(Math.random() * 2) - 1;

    // Disallow static velocity
    vx = vx === 0 ? 1 : vx;
    vy = vy === 0 ? 1 : vy;

    // Somewhere between 10 and speedLimit
    const speed = Math.floor(Math.random() * speedLimit + 10);

    obj.x = xx;
    obj.y = yy;
    obj.body.setVelocity(vx * speed, vy * speed);
    obj.body.bounce.setTo(1, 1);
    obj.body.angularVelocity = 1;
    obj.body.collideWorldBounds = true;
  }
}
