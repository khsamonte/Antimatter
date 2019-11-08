/**
 * File: SceneMain.js
 * Author: Ken
 *
 * The main scene of the game.
 *
 * Copyright (C) November 2019, Ken Samonte
 */

class SceneMain extends Phaser.Scene {
  constructor() {
    super("SceneMain");
  }

  create() {
    // Setup
    emitter = new Phaser.Events.EventEmitter();
    controller = new Controller();
    const mediaManager = new MediaManager({ scene: this });

    // Game Condition (Win / Lose)
    model.playerWon = true;

    /**
     * ----------------
     * Game Stats
     * ----------------
     */

    // Initialise stopwatch components
    this.seconds = 0;
    this.minutes = 0;

    // Initialise HP
    this.totalPlayerLife = 70;
    this.totalEnemyLife = 120;

    this.playerHP = this.totalPlayerLife;
    this.enemyHP = 120;

    // Default ship velocity (diagonal)
    this.shipVelocity = 100;
    this.shipVelocityDiag = 80;

    // Player Batteries
    this.batteries = 0;
    this.stillBoosting = false;

    // Shield
    this.wearingShield = false;

    // Centre of the screen
    this.centerX = game.config.width / 2;
    this.centerY = game.config.height / 2;

    /**
     * ----------------
     * Add images, sprites, and animations
     * ----------------
     */

    // Add background image
    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0);

    // Add the player ship to the centre of the screen
    this.ship = this.physics.add.sprite(this.centerX, this.centerY, "ship");
    this.ship.body.collideWorldBounds = true;
    Align.scaleToGameWidth(this.ship, 0.125);

    // Add the enemy ship to the top centre of the screen
    this.eship = this.physics.add.sprite(this.centerX, 0, "eship");
    this.eship.body.collideWorldBounds = true;
    Align.scaleToGameWidth(this.eship, 0.25);

    // Scale background relative to the scaling of the ship
    this.background.scaleX = this.ship.scaleX;
    this.background.scaleY = this.ship.scaleY;

    // Explosion frames and animation (small to big)
    const expFrames = this.anims.generateFrameNumbers("exp");
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

    /**
     * ----------------
     * Keyboard Events
     * ----------------
     */

    // Use turbo by pressing "Z"
    this.boostKey = this.input.keyboard.addKey("Z");
    this.boostKey.on("down", this.boostShip, this);

    // Fire lasers by pressing "C"
    this.fireKey = this.input.keyboard.addKey("C");
    this.fireKey.on("down", this.fireBullet, this);

    /**
     * ----------------
     * Initialising the world and camera
     * ----------------
     */

    /**
     * Set the boundaries of the world as the
     * total w and h of the background image.
     */
    this.physics.world.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight
    );

    /**
     * Scrolling Background Effect:
     * Set the bounds for camera according to the background image
     * Then have the camera follow the ship
     */
    this.cameras.main.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight
    );
    this.cameras.main.startFollow(this.ship, true);

    // Groups allow similar objects to have uniform behaviour
    this.bulletGroup = this.physics.add.group({});
    this.eBulletGroup = this.physics.add.group({});
    this.rockGroup = this.physics.add.group({});
    this.starGroup = this.physics.add.group({});
    this.batteryGroup = this.physics.add.group({});
    this.shieldGroup = this.physics.add.group({});

    // Generate the information panels then set asteroids and colliders
    this.makeInfo();
    this.batteriesInfo();
    this.spawnAsteroids();
    this.setColliders();

    // TODO: Sound Buttons for mobile
    // const sb = new SoundButtons({ scene: this });
  }

  /**
   * ----------------
   * Generating Objects Methods
   * ----------------
   */

  // Set random position coordinates where the object will spawn
  randomiseInitialPos() {
    const xPos = Math.floor(Math.random() * this.background.displayWidth);
    const yPos = Math.floor(Math.random() * this.background.displayHeight);

    return {
      xx: xPos,
      xy: yPos
    };
  }

  // Set random initial velocity physics to the object
  randomiseInitialVelocity(speedLimit) {
    let vx = Math.floor(Math.random() * 2) - 1;
    let vy = Math.floor(Math.random() * 2) - 1;

    // Disallow static velocity
    vx = vx === 0 ? 1 : vx;
    vy = vy === 0 ? 1 : vy;

    // Somewhere between 10 and speedLimit
    const speed = Math.floor(Math.random() * speedLimit + 10);

    return {
      x: vx * speed,
      y: vy * speed
    };
  }

  spawnStar() {
    // Add the sprite
    const position = this.randomiseInitialPos();
    const velocity = this.randomiseInitialVelocity(150);

    const star = this.physics.add.sprite(position.xx, position.yy, "star");
    Align.scaleToGameWidth(star, 0.05);
    this.starGroup.add(star);

    // Set the interaction collision of the object
    star.body.setVelocity(velocity.x, velocity.y);
    star.body.bounce.setTo(1, 1);
    star.body.angularVelocity = 1;
    star.body.collideWorldBounds = true;

    this.setStarColliders();
  }

  // spawnStar() {
  //   // Random coordinates
  //   const xx = Math.floor(Math.random() * this.background.displayWidth);
  //   const yy = Math.floor(Math.random() * this.background.displayHeight);

  //   // Apply physics to the stars (-1, 0, 1)
  //   let vx = Math.floor(Math.random() * 2) - 1;
  //   let vy = Math.floor(Math.random() * 2) - 1;

  //   // Avoid immobile spawning of star
  //   vx = vx === 0 ? 1 : vx;
  //   vy = vy === 0 ? 1 : vy;

  //   // Somewhere between 10 and 150
  //   const speed = Math.floor(Math.random() * 150 + 10);

  //   // Add the sprite
  //   const star = this.physics.add.sprite(xx, yy, "star");
  //   Align.scaleToGameWidth(star, 0.05);
  //   this.starGroup.add(star);

  //   // Set the interaction collision of the star
  //   star.body.setVelocity(vx * speed, vy * speed);
  //   star.body.bounce.setTo(1, 1);
  //   star.body.angularVelocity = 1;
  //   star.body.collideWorldBounds = true;

  //   this.setStarColliders();
  // }

  spawnBattery() {
    // Random coordinates
    const xx = Math.floor(Math.random() * this.background.displayWidth);
    const yy = Math.floor(Math.random() * this.background.displayHeight);

    // Apply physics to the batteries (-1, 0, 1)
    let vx = Math.floor(Math.random() * 2) - 1;
    let vy = Math.floor(Math.random() * 2) - 1;

    // Avoid immobile spawning of battery
    vx = vx === 0 ? 1 : vx;
    vy = vy === 0 ? 1 : vy;

    // Somewhere between 10 and 50
    const speed = Math.floor(Math.random() * 50 + 10);

    // Add the sprite
    const battery = this.physics.add.sprite(xx, yy, "battery");
    Align.scaleToGameWidth(battery, 0.03);
    this.batteryGroup.add(battery);

    // Set the interaction collision of the battery
    battery.body.setVelocity(vx * speed, vy * speed);
    battery.body.bounce.setTo(1, 1);
    battery.body.angularVelocity = 1;
    battery.body.collideWorldBounds = true;

    this.setBatteryColliders();
  }

  spawnShield() {
    // Random coordinates
    const xx = Math.floor(Math.random() * this.background.displayWidth);
    const yy = Math.floor(Math.random() * this.background.displayHeight);

    // Apply physics to the batteries (-1, 0, 1)
    let vx = Math.floor(Math.random() * 2) - 1;
    let vy = Math.floor(Math.random() * 2) - 1;

    // Avoid immobile spawning of battery
    vx = vx === 0 ? 1 : vx;
    vy = vy === 0 ? 1 : vy;

    // Somewhere between 10 and 50
    const speed = Math.floor(Math.random() * 50 + 10);

    // Add the sprite
    const shield = this.physics.add.sprite(xx, yy, "shield");
    Align.scaleToGameWidth(shield, 0.1);
    this.shieldGroup.add(shield);

    // Set the interaction collision of the battery
    shield.body.setVelocity(vx * speed, vy * speed);
    shield.body.bounce.setTo(1, 1);
    shield.body.angularVelocity = 1;
    shield.body.collideWorldBounds = true;

    this.setShieldGroupColliders();
  }

  // Generate 12 asteroids if all asteroids have exploded
  spawnAsteroids() {
    /**
     * Add a bunch of sprites into the group
     * frameQuantity is the amount to be spawned per frame
     */
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
      this.rockGroup.children.iterate(
        function(child) {
          // Randomise spawn of asteroids anywhere in the field
          const xx = Math.floor(Math.random() * this.background.displayWidth);
          const yy = Math.floor(Math.random() * this.background.displayHeight);
          child.x = xx;
          child.y = yy;
          Align.scaleToGameWidth(child, 0.1);

          // Apply physics to the asteroids (-1, 0, 1)
          let vx = Math.floor(Math.random() * 2) - 1;
          let vy = Math.floor(Math.random() * 2) - 1;

          // Avoid immobile spawning of asteroid
          if (vx === 0 && vy === 0) {
            vx = 1;
            vy = 1;
          }

          // Somewhere between 10 and 200
          const speed = Math.floor(Math.random() * 200 + 10);
          child.body.setVelocity(vx * speed, vy * speed);
        }.bind(this)
      );

      this.setRockColliders();
    }
  }

  setColliders() {
    // Bullets vs Ships
    this.physics.add.collider(
      this.bulletGroup,
      this.eship,
      this.damageEnemy,
      null,
      this
    );
    this.physics.add.collider(
      this.eBulletGroup,
      this.ship,
      this.damagePlayer,
      null,
      this
    );
  }

  setStarColliders() {
    this.physics.add.collider(this.starGroup);
    this.physics.add.collider(this.starGroup, this.rockGroup);

    this.physics.add.collider(
      this.starGroup,
      this.ship,
      this.healPlayer,
      null,
      this
    );
    this.physics.add.collider(
      this.starGroup,
      this.eship,
      this.destroyStar,
      null,
      this
    );

    this.physics.add.collider(
      this.starGroup,
      this.bulletGroup,
      this.destroyStar2,
      null,
      this
    );
    this.physics.add.collider(
      this.starGroup,
      this.eBulletGroup,
      this.destroyStar2,
      null,
      this
    );
  }

  setBatteryColliders() {
    this.physics.add.collider(this.batteryGroup);
    this.physics.add.collider(this.batteryGroup, this.eship);
    this.physics.add.collider(this.batteryGroup, this.rockGroup);
    this.physics.add.collider(this.batteryGroup, this.starGroup);

    // Ship obtains battery
    this.physics.add.collider(
      this.batteryGroup,
      this.ship,
      this.obtainBattery,
      null,
      this
    );
  }

  setShieldColliders() {
    this.physics.add.collider(
      this.rockGroup,
      this.shield,
      this.destroyRockOnly,
      null,
      this
    );

    this.physics.add.collider(
      this.shield,
      this.eBulletGroup,
      this.destroyEBullet,
      null,
      this
    );
  }

  setShieldGroupColliders() {
    this.physics.add.collider(this.shieldGroup, this.eship);
    this.physics.add.collider(this.shieldGroup, this.rockGroup);
    this.physics.add.collider(this.shieldGroup, this.starGroup);
    this.physics.add.collider(this.shieldGroup, this.batteryGroup);

    // Ship obtains battery
    this.physics.add.collider(
      this.shieldGroup,
      this.ship,
      this.useShield,
      null,
      this
    );
  }

  // Create colliders for rocks
  setRockColliders() {
    this.physics.add.collider(this.rockGroup);

    this.physics.add.collider(
      this.rockGroup,
      this.ship,
      this.rockHitPlayer,
      null,
      this
    );
    this.physics.add.collider(
      this.rockGroup,
      this.eship,
      this.rockHitEnemy,
      null,
      this
    );

    // Rocks + bullets
    this.physics.add.collider(
      this.rockGroup,
      this.bulletGroup,
      this.destroyRock,
      null,
      this
    );
    this.physics.add.collider(
      this.rockGroup,
      this.eBulletGroup,
      this.destroyRock,
      null,
      this
    );
  }

  makeInfo() {
    this.playerHPText = this.add.text(
      0,
      0,
      "Your Ship\n" + this.totalPlayerLife,
      {
        align: "center",
        fontFamily: "Varela Round",
        fontSize: game.config.width / 30,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      }
    );
    this.enemyHPText = this.add.text(0, 0, "Mothership\n120", {
      align: "center",
      fontFamily: "Varela Round",
      fontSize: game.config.width / 30,
      backgroundColor: "rgba(0, 0, 0, 0.5)"
    });
    this.gameTimerText = this.add.text(0, 0, "00:00", {
      align: "center",
      fontFamily: "Varela Round",
      fontSize: game.config.width / 25,
      backgroundColor: "rgba(0, 0, 0, 0.5)"
    });

    this.playerHPText.setOrigin(0.5, 0.5);
    this.enemyHPText.setOrigin(0.5, 0.5);
    this.gameTimerText.setOrigin(0.5, 0.5);

    this.uiGrid = new AlignGrid({ scene: this, rows: 11, cols: 11 });
    // this.uiGrid.showNumbers();

    this.uiGrid.placeAtIndex(2, this.playerHPText);
    this.uiGrid.placeAtIndex(5, this.gameTimerText);
    this.uiGrid.placeAtIndex(9, this.enemyHPText);

    // Icons of the ships
    this.shipIcon = this.add.image(0, 0, "ship");
    this.mothershipIcon = this.add.image(0, 0, "eship");
    Align.scaleToGameWidth(this.shipIcon, 0.05);
    Align.scaleToGameWidth(this.mothershipIcon, 0.05);
    this.uiGrid.placeAtIndex(0, this.shipIcon);
    this.uiGrid.placeAtIndex(7, this.mothershipIcon);
    this.shipIcon.angle = 270;
    this.mothershipIcon.angle = 270;

    // Fix the position of the texts
    this.playerHPText.setScrollFactor(0);
    this.enemyHPText.setScrollFactor(0);
    this.gameTimerText.setScrollFactor(0);
    this.shipIcon.setScrollFactor(0);
    this.mothershipIcon.setScrollFactor(0);
  }

  batteriesInfo() {
    if (this.batteryIcon) {
      this.batteryIcon.destroy();
    }
    if (this.batteryIcon2) {
      this.batteryIcon2.destroy();
    }
    if (this.batteryIcon3) {
      this.batteryIcon3.destroy();
    }

    if (this.batteries > 0) {
      this.batteryIcon = this.add.image(0, 0, "battery");
      Align.scaleToGameWidth(this.batteryIcon, 0.025);
      this.uiGrid.placeAtIndex(21, this.batteryIcon);
      this.batteryIcon.setScrollFactor(0);
    }

    if (this.batteries > 1) {
      this.batteryIcon2 = this.add.image(0, 0, "battery");
      Align.scaleToGameWidth(this.batteryIcon2, 0.025);
      this.batteryIcon2.x = this.batteryIcon.x - game.config.width * 0.035;
      this.batteryIcon2.y = this.batteryIcon.y;
      this.batteryIcon2.setScrollFactor(0);
    }

    if (this.batteries > 2) {
      this.batteryIcon3 = this.add.image(0, 0, "battery");
      Align.scaleToGameWidth(this.batteryIcon3, 0.025);
      this.batteryIcon3.x = this.batteryIcon2.x - game.config.width * 0.035;
      this.batteryIcon3.y = this.batteryIcon.y;
      this.batteryIcon3.setScrollFactor(0);
    }
  }

  destroyRock(bullet, rock) {
    bullet.destroy();

    // Add the sprite image then play the animation
    const explosion = this.add.sprite(rock.x, rock.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");

    rock.destroy();
    this.spawnAsteroids();
  }

  destroyRockOnly(object, rock) {
    rock.destroy();

    // Add the sprite image then play the animation
    const explosion = this.add.sprite(rock.x, rock.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");
  }

  destroyEBullet(shield, eBullet) {
    eBullet.destroy();

    // Add the sprite image then play the animation
    const explosion = this.add.sprite(eBullet.x, eBullet.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");
  }

  damagePlayer(ship, bullet) {
    const explosion = this.add.sprite(this.ship.x, this.ship.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");
    if (!this.wearingShield) {
      this.playerHP -= 2;
      this.downPlayer();
      bullet.destroy();
    }
  }

  damageEnemy(ship, bullet) {
    const explosion = this.add.sprite(bullet.x, bullet.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");
    this.downEnemy();
    bullet.destroy();

    let enemyAngle = this.physics.moveTo(
      this.eship,
      this.ship.x,
      this.ship.y,
      100
    );
    enemyAngle = this.toDegrees(enemyAngle);
    this.eship.angle = enemyAngle;
  }

  downPlayer() {
    this.playerHPText.setText("Your Ship\n" + this.playerHP);
    if (this.playerHP < 1) {
      model.playerWon = false;
      this.scene.start("SceneOver");
    }
  }

  downEnemy() {
    this.enemyHP -= 1;
    this.enemyHPText.setText("Mothership\n" + this.enemyHP);
    if (this.enemyHP < 1) {
      model.playerWon = true;
      this.scene.start("SceneOver");
    }
  }

  stopwatch() {
    let minuteText = "";
    let secondText = "";
    let elapsed = Math.abs(this.lastSecond - this.getTimer());
    if (elapsed < 1000) {
      return;
    }
    this.lastSecond = this.getTimer();

    // Seconds conditions
    this.seconds += 1;

    // Spawns a star every 20 seconds
    if (this.seconds % 5 === 0) {
      this.spawnStar();
    }

    // Spawns a battery every 30 seconds
    if (this.seconds % 30 === 0) {
      this.spawnBattery();
    }

    // Spawns a shield every 40th second of a minute
    if (this.seconds % 40 === 0) {
      this.spawnShield();
    }

    if (this.seconds === 60) {
      this.seconds = 0;
      this.minutes += 1;
    }

    // Add zero for seconds
    if (this.seconds < 10) {
      secondText = "0" + this.seconds;
    } else {
      secondText = this.seconds;
    }

    // Add zero for minutes
    if (this.minutes < 10) {
      minuteText = "0" + this.minutes;
    } else {
      minuteText = this.minutes;
    }

    this.gameTimerText.setText(minuteText + ":" + secondText);
  }

  // Heals the player ship by 5 HP when the star is grabbed
  healPlayer(ship, star) {
    star.destroy();
    emitter.emit(G.PLAY_STAR_SOUND, "starSound");
    if (this.playerHP < 68) {
      this.playerHP += 2;
    } else {
      this.playerHP = this.totalPlayerLife;
    }
    this.playerHPText.setText("Your Ship\n" + this.playerHP);
  }

  obtainBattery(ship, battery) {
    battery.destroy();
    emitter.emit(G.PLAY_STAR_SOUND, "starSound");
    if (this.batteries < 3) {
      this.batteries += 1;
      this.batteriesInfo();
    }
  }

  destroyStar(ship, star) {
    const explosion = this.add.sprite(star.x, star.y, "exp");
    explosion.play("boom");
    star.destroy();
  }

  destroyStar2(star, bullet) {
    const explosion = this.add.sprite(star.x, star.y, "exp");
    explosion.play("boom");
    bullet.destroy();
    star.destroy();
  }

  rockHitPlayer(ship, rock) {
    const explosion = this.add.sprite(rock.x, rock.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");
    rock.destroy();
    this.spawnAsteroids();

    if (!this.wearingShield) {
      this.playerHP -= 1;
      this.downPlayer();
    }
  }

  rockHitEnemy(ship, rock) {
    const explosion = this.add.sprite(rock.x, rock.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");
    rock.destroy();
    this.spawnAsteroids();
    this.downEnemy();
  }

  getTimer() {
    const d = new Date();
    return d.getTime();
  }

  // KEYBOARD CONTROLS
  moveUp() {
    this.ship.setVelocityY(-this.shipVelocity);
    this.ship.angle = 270;
    this.enemyShipChase();
  }
  moveDown() {
    this.ship.setVelocityY(this.shipVelocity);
    this.ship.angle = 90;
    this.enemyShipChase();
  }
  moveLeft() {
    this.ship.setVelocityX(-this.shipVelocity);
    this.ship.angle = 180;
    this.enemyShipChase();
  }
  moveRight() {
    this.ship.setVelocityX(this.shipVelocity);
    this.ship.angle = 0;
    // this.shield.x = this.ship.x;
    // this.shield.y = this.ship.y;
    // this.shield.angle = this.ship.angle;
    this.enemyShipChase();
  }

  shiftSouthEast() {
    this.ship.setVelocityX(this.shipVelocityDiag);
    this.ship.setVelocityY(this.shipVelocityDiag);
    this.ship.angle = 45;
  }
  shiftSouthWest() {
    this.ship.setVelocityX(-this.shipVelocityDiag);
    this.ship.setVelocityY(this.shipVelocityDiag);
    this.ship.angle = 135;
  }
  shiftNorthWest() {
    this.ship.setVelocityX(-this.shipVelocityDiag);
    this.ship.setVelocityY(-this.shipVelocityDiag);
    this.ship.angle = 225;
  }
  shiftNorthEast() {
    this.ship.setVelocityX(this.shipVelocityDiag);
    this.ship.setVelocityY(-this.shipVelocityDiag);
    this.ship.angle = 315;
  }

  // Z
  boostShip() {
    if (!this.stillBoosting) {
      if (this.batteries > 0) {
        this.stillBoosting = true;
        this.batteries -= 1;
        this.shipVelocity = 200;
        this.shipVelocityDiag = 180;
        this.batteriesInfo();

        setTimeout(() => {
          this.shipVelocity = 100;
          this.shipVelocityDiag = 80;
          this.stillBoosting = false;
        }, 2000);
      }
    }
  }

  // X
  useShield(ship, shield) {
    if (!this.wearingShield) {
      shield.destroy();
      this.wearingShield = true;

      this.shield = this.physics.add.sprite(this.ship.x, this.ship.y, "shield");
      Align.scaleToGameWidth(this.shield, 0.225);
      this.setShieldColliders();

      // Callback
      this.time.delayedCall(10000, this.removeShield, [], this);
    }
  }

  removeShield() {
    if (this.wearingShield) {
      this.shield.destroy();
      this.wearingShield = false;
    }
  }

  paintShield() {
    if (this.shield) {
      this.shield.x = this.ship.x;
      this.shield.y = this.ship.y;
      this.shield.angle = this.ship.angle;
    }
  }

  //
  fireBullet() {
    const directionObject = this.getDirectionFromAngle(this.ship.angle);
    const projectileSpeed = 200;

    const bullet = this.physics.add.sprite(
      this.ship.x + directionObject.tx * 30,
      this.ship.y + directionObject.ty * 30,
      "bullet"
    );
    this.bulletGroup.add(bullet);
    bullet.angle = this.ship.angle;

    // Set the velocity based on the direction object
    bullet.body.setVelocity(
      directionObject.tx * projectileSpeed,
      directionObject.ty * projectileSpeed
    );

    emitter.emit(G.PLAY_SOUND, "laser");
  }

  // Fires the enemy bullet every 0.5 seconds
  fireEnemyBullet() {
    let elapsed = Math.abs(this.lastEBullet - this.getTimer());

    if (elapsed < 500) {
      return;
    }

    this.lastEBullet = this.getTimer();

    const eBullet = this.physics.add.sprite(
      this.eship.x,
      this.eship.y,
      "ebullet"
    );
    this.eBulletGroup.add(eBullet);
    eBullet.body.angularVelocity = 20;
    this.physics.moveTo(eBullet, this.ship.x, this.ship.y, 100);
    emitter.emit(G.PLAY_SOUND, "enemyShoot");
  }

  enemyShipChase() {
    let mothershipSpeed = 50;

    if (this.enemyHP < this.totalEnemyLife / 2) {
      mothershipSpeed = 65;
    }

    if (this.enemyHP < this.totalEnemyLife / 4) {
      mothershipSpeed = 80;
    }

    // Enemy ship movement
    let enemyAngle = this.physics.moveTo(
      this.eship,
      this.ship.x,
      this.ship.y,
      mothershipSpeed
    );
    enemyAngle = this.toDegrees(enemyAngle);
    this.eship.angle = enemyAngle;
  }

  // Get direction from angle
  getDirectionFromAngle(angle) {
    const rads = (angle * Math.PI) / 180;
    const tx = Math.cos(rads);
    const ty = Math.sin(rads);

    return { tx, ty };
  }

  // Converts radians to degrees
  toDegrees(angle) {
    return angle * (180 / Math.PI);
  }

  update() {
    this.stopwatch();
    this.ship.setVelocityX(0);
    this.ship.setVelocityY(0);

    if (this.shield) {
      this.paintShield();
      this.shield.alpha -= 0.0015;
    }

    // Controls
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.moveLeft();
    } else if (cursors.up.isDown) {
      this.moveUp();
    } else if (cursors.down.isDown) {
      this.moveDown();
    } else if (cursors.right.isDown) {
      this.moveRight();
    }

    if (cursors.left.isDown && cursors.up.isDown) {
      this.shiftNorthWest();
    } else if (cursors.right.isDown && cursors.up.isDown) {
      this.shiftNorthEast();
    } else if (cursors.right.isDown && cursors.down.isDown) {
      this.shiftSouthEast();
    } else if (cursors.left.isDown && cursors.down.isDown) {
      this.shiftSouthWest();
    }

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

    if (this.enemyHP < Math.floor(this.totalEnemyLife / 2)) {
      range = 4;
    }
    if (this.enemyHP < Math.floor(this.totalEnemyLife / 3)) {
      range = 3;
    }
    if (this.enemyHP < Math.floor(this.totalEnemyLife / 4)) {
      range = 2;
    }
    if (this.enemyHP < Math.floor(this.totalEnemyLife / 5)) {
      range = 1;
    }

    // Fire bullet if ship gets close
    // this.fireEnemyBullet();
    if (
      shipDistX < game.config.width / range &&
      shipDistY < game.config.height / range
    ) {
      this.fireEnemyBullet();
    }
  }
}
