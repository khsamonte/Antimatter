class Collision {
  static checkCollide(obj1, obj2) {
    let distanceX = Math.abs(obj1.x - obj2.x);
    let distanceY = Math.abs(obj1.y - obj2.y);

    if (distanceX < obj1.width / 2) {
      if (distanceY < obj1.height / 2) {
        return true;
      }
    }

    return false;
  }
}