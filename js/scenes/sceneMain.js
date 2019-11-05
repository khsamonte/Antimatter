class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
  }
  create() {
    emitter = new Phaser.Events.EventEmitter();
    controller = new Controller();
    const mediaManager = new MediaManager({ scene: this });

    // Life
    this.playerLife = 50;
    this.enemyLife = 120;
    this.totalEL = 120;
    model.playerWon = true;

    // Centre of the screen
    this.centerX = game.config.width / 2;
    this.centerY = game.config.height / 2;

    // Add background
    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0);

    // Add ship to the centre of the screen
    this.ship = this.physics.add.sprite(this.centerX, this.centerY, "ship");
    this.ship.body.collideWorldBounds = true;
    Align.scaleToGameWidth(this.ship, 0.125);

    // Scale background just like how ship is scaled
    this.background.scaleX = this.ship.scaleX;
    this.background.scaleY = this.ship.scaleY;

    // Sets the boundaries of the world as the total w and h of the space image
    this.physics.world.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight);

    // Make background listen to events (to move the ship)
    this.background.setInteractive();
    this.background.on("pointerdown", this.backgroundClicked, this);

    // Fire bullet on pressing "W"
    this.fireKey = this.input.keyboard.addKey("W");
    this.fireKey.on("down", this.fireBullet, this);

    /**
     * SCROLLING BACKGROUND
     * Set the bounds for camera according to the space image
     * Have the camera follow the ship
     */
    this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight);
    this.cameras.main.startFollow(this.ship, true);

    /**
     * Add a bunch of sprites into the group
     * frameQuantity is the amount to be spawned per frame
     *
     */
    this.bulletGroup = this.physics.add.group({});
    this.eBulletGroup = this.physics.add.group({});
    this.rockGroup = this.physics.add.group({});
    this.makeRocks();

    // Explosion frames and animation
    const expFrames = this.anims.generateFrameNumbers("exp");
    // Small to big
    const expFrames2 = expFrames.slice();
    expFrames2.reverse();
    const expFrames3 = expFrames2.concat(expFrames);

    // Create the explosion animation
    this.anims.create({
      key: "boom",
      frames: expFrames3,
      frameRate: 48,
      repeat: false
    });

    // Adding the enemy ship!
    this.eship = this.physics.add.sprite(this.centerX, 0, "eship");
    this.eship.body.collideWorldBounds = true;
    Align.scaleToGameWidth(this.eship, 0.25);

    this.makeInfo();
    this.setColliders();

    // const sb = new SoundButtons({ scene: this });
  }

  makeRocks() {
    if (this.rockGroup.getChildren().length === 0) {
      this.rockGroup = this.physics.add.group({
        key: "rocks",
        frame: [0, 1, 2],
        frameQuantity: 4,
        bounceX: 1,
        bounceY: 1,
        angularVelocity: 1,
        collideWorldBounds: true
      });

      // Randomise every group node's x and y in the whole background
      this.rockGroup.children.iterate(function (child) {
        const xx = Math.floor(Math.random() * this.background.displayWidth);
        const yy = Math.floor(Math.random() * this.background.displayHeight);

        child.x = xx;
        child.y = yy;
        Align.scaleToGameWidth(child, 0.1);

        // Apply physics to the asteroids (-1, 0, 1)
        let vx = Math.floor(Math.random() * 2) - 1;
        let vy = Math.floor(Math.random() * 2) - 1;

        if (vx === 0 && vy === 0) {
          vx = 1;
          vy = 1;
        }

        // Somewhere between 10 and 200
        const speed = Math.floor(Math.random() * 200 + 10);
        child.body.setVelocity(vx * speed, vy * speed);
      }.bind(this));

      this.setRockColliders();
    }
  }

  setColliders() {
    // Bullets vs Ships
    this.physics.add.collider(this.bulletGroup, this.eship, this.damageEnemy, null, this);
    this.physics.add.collider(this.eBulletGroup, this.ship, this.damagePlayer, null, this);
  }

  setRockColliders() {
    // Create colliders for rocks
    this.physics.add.collider(this.rockGroup);

    // Rocks + bullets
    this.physics.add.collider(this.bulletGroup, this.rockGroup, this.destroyRock, null, this);
    this.physics.add.collider(this.eBulletGroup, this.rockGroup, this.destroyRock, null, this);

    this.physics.add.collider(this.rockGroup, this.ship, this.rockHitPlayer, null, this);
    this.physics.add.collider(this.rockGroup, this.eship, this.rockHitEnemy, null, this);
  }

  makeInfo() {
    this.text1 = this.add.text(0, 0, "Your Ship\n50",
      {
        fontSize: game.config.width / 30,
        align: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      }
    );
    this.text2 = this.add.text(0, 0, "Mothership\n120",
      {
        fontSize: game.config.width / 30,
        align: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      }
    );

    this.text1.setOrigin(0.5, 0.5);
    this.text2.setOrigin(0.5, 0.5);

    this.uiGrid = new AlignGrid({ scene: this, rows: 11, cols: 11 });
    // this.uiGrid.showNumbers();

    this.uiGrid.placeAtIndex(2, this.text1);
    this.uiGrid.placeAtIndex(8, this.text2);

    // Icons of the ships
    this.icon1 = this.add.image(0, 0, "ship");
    this.icon2 = this.add.image(0, 0, "eship");
    Align.scaleToGameWidth(this.icon1, 0.05);
    Align.scaleToGameWidth(this.icon2, 0.05);
    this.uiGrid.placeAtIndex(0, this.icon1);
    this.uiGrid.placeAtIndex(6, this.icon2);
    this.icon1.angle = 270;
    this.icon2.angle = 270;

    // Fix the position of the texts
    this.text1.setScrollFactor(0);
    this.text2.setScrollFactor(0);
    this.icon1.setScrollFactor(0);
    this.icon2.setScrollFactor(0);
  }

  destroyRock(bullet, rock) {
    bullet.destroy();

    // Add the sprite image then play the animation
    const explosion = this.add.sprite(rock.x, rock.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");

    rock.destroy();
    this.makeRocks();
  }

  damagePlayer(ship, bullet) {
    const explosion = this.add.sprite(this.ship.x, this.ship.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");
    this.downPlayer();
    bullet.destroy();
  }

  damageEnemy(ship, bullet) {
    const explosion = this.add.sprite(bullet.x, bullet.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");
    this.downEnemy();
    bullet.destroy();

    let enemyAngle = this.physics.moveTo(this.eship, this.ship.x, this.ship.y, 100);
    enemyAngle = this.toDegrees(enemyAngle);
    this.eship.angle = enemyAngle;
  }

  downPlayer() {
    this.playerLife -= 1;
    this.text1.setText("Your Ship\n" + this.playerLife);
    if (this.playerLife === 0) {
      model.playerWon = false;
      this.scene.start("SceneOver");
    }
  }

  downEnemy() {
    this.enemyLife -= 1;
    this.text2.setText("Mothership\n" + this.enemyLife);
    if (this.enemyLife === 0) {
      model.playerWon = true;
      this.scene.start("SceneOver");
    }
  }

  rockHitPlayer(ship, rock) {
    const explosion = this.add.sprite(rock.x, rock.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");
    rock.destroy();
    this.makeRocks();
    this.downPlayer();
  }

  rockHitEnemy(ship, rock) {
    const explosion = this.add.sprite(rock.x, rock.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");
    rock.destroy();
    this.makeRocks();
    this.downEnemy();
  }

  // The ship moves to where the mouse clicks
  backgroundClicked() {
    // Note: localX and localY are Phaser functions
    this.targetX = this.background.input.localX * this.background.scaleX;
    this.targetY = this.background.input.localY * this.background.scaleX;

    // moveTo returns an angle. The sprite's "angle" property is where it faces
    let angle = this.physics.moveTo(this.ship, this.targetX, this.targetY, 100);
    angle = this.toDegrees(angle);
    this.ship.angle = angle;

    let shipDistX = Math.abs(this.ship.x - this.targetX);
    let shipDistY = Math.abs(this.ship.y - this.targetY);

    // The ship will only chase you if you moved a distance > 30
    if (shipDistX > 30 && shipDistY > 30) {
      let speed = 50;

      if (this.enemyLife < this.totalEL / 2) {
        speed = 70;
      }

      if (this.enemyLife < this.totalEL / 4) {
        speed = 90;
      }

      // Enemy ship movement
      let enemyAngle = this.physics.moveTo(this.eship, this.ship.x, this.ship.y, speed);
      enemyAngle = this.toDegrees(enemyAngle);
      this.eship.angle = enemyAngle;
    }
  }

  getTimer() {
    const d = new Date();
    return d.getTime();
  }

  fireBullet() {
    const dirObj = this.getDirFromAngle(this.ship.angle);
    const projectileSpeed = 200;

    const bullet = this.physics.add.sprite(this.ship.x + dirObj.tx * 30, this.ship.y + dirObj.ty * 30, "bullet");
    this.bulletGroup.add(bullet);
    bullet.angle = this.ship.angle;
    bullet.body.setVelocity(dirObj.tx * projectileSpeed, dirObj.ty * projectileSpeed);

    emitter.emit(G.PLAY_SOUND, "laser");
  }

  // Fires the enemy bullet every 0.5 seconds
  fireEnemyBullet() {
    let elapsed = Math.abs(this.lastEBullet - this.getTimer());

    if (elapsed < 500) {
      return;
    }

    this.lastEBullet = this.getTimer();

    const eBullet = this.physics.add.sprite(this.eship.x, this.eship.y, "ebullet");
    this.eBulletGroup.add(eBullet);
    eBullet.body.angularVelocity = 10;
    this.physics.moveTo(eBullet, this.ship.x, this.ship.y, 100);
    emitter.emit(G.PLAY_SOUND, "enemyShoot");
  }

  // Get direction from angle
  getDirFromAngle(angle) {
    const rads = angle * Math.PI / 180;
    const tx = Math.cos(rads);
    const ty = Math.sin(rads);

    return { tx, ty }
  }

  // Converts radians to degrees
  toDegrees(angle) {
    return angle * (180 / Math.PI);
  }

  update() {
    // Detect proximity between _____
    let distanceX = Math.abs(this.ship.x - this.targetX);
    let distanceY = Math.abs(this.ship.y - this.targetY);
    let range = 5;

    if (distanceX < 10 && distanceY < 10) {
      this.ship.body.setVelocity(0, 0);
    }

    // Detect proximity between ship and eship
    let shipDistX = Math.abs(this.ship.x - this.eship.x);
    let shipDistY = Math.abs(this.ship.y - this.eship.y);

    if (this.enemyLife < Math.floor(this.totalEL / 2)) {
      range = 4;
    }
    if (this.enemyLife < Math.floor(this.totalEL / 3)) {
      range = 3;
    }
    if (this.enemyLife < Math.floor(this.totalEL / 4)) {
      range = 2;
    }
    if (this.enemyLife < Math.floor(this.totalEL / 5)) {
      range = 1;
    }

    // Fire bullet if ship gets close
    // this.fireEnemyBullet();
    if (shipDistX < game.config.width / range && shipDistY < game.config.height / range) {
      this.fireEnemyBullet();
    }
  }
}