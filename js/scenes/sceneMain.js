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
    /**
     * ----------------
     * Setting up events and media
     * ----------------
     */
    emitter = new Phaser.Events.EventEmitter();
    controller = new Controller();
    const mediaManager = new MediaManager({ scene: this });

    // The state of the game
    model.playerWon = true;

    // Centre of the screen
    this.centerX = game.config.width / 2;
    this.centerY = game.config.height / 2;

    // Initialise time components
    this.seconds = 0;
    this.minutes = 0;

    // Add background image
    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0);

    // Adds the first space objects
    this.createBlackHole();
    this.createShip();
    this.createMothership();

    // Scale background relative to the scaling of the ship
    this.background.scaleX = this.ship.scaleX;
    this.background.scaleY = this.ship.scaleY;

    // Add the animations
    this.createExplosionAnimation();

    // Setting up the game itself
    this.setKeyboardEvents();
    this.setWorldBoundaries();
    this.setGroups();

    // Generate the information panels then set asteroids and colliders
    this.makeInfo();
    this.batteriesInfo();
    this.spawnInitialGameObjects();

    // TODO: Sound Buttons for mobile
    // const sb = new SoundButtons({ scene: this });
  }

  /**
   * ----------------
   * Setting up the game
   * ----------------
   */

  // Set up the world and camera
  setWorldBoundaries() {
    const totalWidth = this.background.displayWidth;
    const totalHeight = this.background.displayHeight;

    // Set the boundaries as the w and h of the background image
    this.physics.world.setBounds(0, 0, totalWidth, totalHeight);
    this.cameras.main.setBounds(0, 0, totalWidth, totalHeight);
    this.cameras.main.startFollow(this.ship, true);
  }

  // Set up the controls
  setKeyboardEvents() {
    // Use turbo by pressing "Z"
    this.boostKey = this.input.keyboard.addKey("Z");
    this.boostKey.on("down", this.boostShip, this);

    // Fire lasers by pressing "C"
    this.fireKey = this.input.keyboard.addKey("C");
    this.fireKey.on("down", this.fireBullet, this);
  }

  // Groups allow similar objects to have uniform behaviour
  setGroups() {
    // Weapons
    this.bulletGroup = this.physics.add.group({});
    this.eBulletGroup = this.physics.add.group({});

    // Items
    this.starGroup = this.physics.add.group({});
    this.batteryGroup = this.physics.add.group({});
    this.shieldGroup = this.physics.add.group({});

    // Space Objects
    this.asteroidGroup = this.physics.add.group({});
    this.meteorGroup = this.physics.add.group({});
    this.wormholeGroup = this.physics.add.group({});
  }

  spawnInitialGameObjects() {
    // Space Objects
    this.spawnAsteroids();
    this.meteorShower();
    this.spawnWormhole();

    // Items
    this.spawnStar();
    this.spawnBattery();
    this.spawnShield();

    // Collisions
    this.setColliders();
  }

  /**
   * ----------------
   * Randomiser utilities
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

  /**
   * ----------------
   * Creating the first objects and animations
   * ----------------
   */

  // The creation of the ship and all its attributes
  createShip() {
    this.ship = this.physics.add.sprite(this.centerX, this.centerY, "ship");
    this.ship.body.collideWorldBounds = true;
    Align.scaleToGameWidth(this.ship, 0.125);

    // HP
    this.totalPlayerLife = 70;
    this.playerHP = this.totalPlayerLife;

    // Items & Status
    this.batteries = 0;
    this.stillBoosting = false;
    this.wearingShield = false;

    // Default ship movement velocity
    this.shipVelocity = 100;
    this.shipVelocityDiag = 80;
  }

  // The creation of the Mothership and all its attributes
  createMothership() {
    this.eship = this.physics.add.sprite(this.centerX, 0, "eship");
    // this.eship.body.bounce.setTo(1, 1);
    this.eship.body.immovable = true;
    this.eship.body.collideWorldBounds = true;
    Align.scaleToGameWidth(this.eship, 0.25);

    // HP
    this.totalEnemyLife = 120;
    this.enemyHP = this.totalEnemyLife;

    // Items & Status
    this.mShipAttacks = 0;
    this.mShipIsCharging = false;
    this.mShipIsSpinning = false;
    this.mShipIsLunging = false;
  }

  // This black hole very slowly move around the map
  createBlackHole() {
    // Randomise initial position and velocity
    const position = this.randomiseInitialPos();
    const velocity = this.randomiseInitialVelocity(30);

    // Create the black hole
    this.blackHole = this.physics.add.sprite(
      position.xx,
      position.yy,
      "blackhole"
    );
    Align.scaleToGameWidth(this.blackHole, 0.25);

    this.blackHole.body.setVelocity(velocity.x, velocity.y);
    this.blackHole.body.bounce.setTo(1, 1);
    this.blackHole.body.angularVelocity = 1;
    this.blackHole.body.collideWorldBounds = true;
  }

  // Animation sprite for explosions
  createExplosionAnimation() {
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
  }

  /**
   * ----------------
   * Generating Objects Methods
   * ----------------
   */

  // Spawn a star in space randomly (time interval set on stopwatch)
  spawnStar() {
    const position = this.randomiseInitialPos();
    const velocity = this.randomiseInitialVelocity(150);

    // Add the sprite
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

  // Spawn a battery in space randomly (time interval set on stopwatch)
  spawnBattery() {
    const position = this.randomiseInitialPos();
    const velocity = this.randomiseInitialVelocity(50);

    // Add the sprite
    const battery = this.physics.add.sprite(
      position.xx,
      position.yy,
      "battery"
    );
    Align.scaleToGameWidth(battery, 0.03);
    this.batteryGroup.add(battery);

    // Set the interaction collision of the battery
    battery.body.setVelocity(velocity.x, velocity.y);
    battery.body.bounce.setTo(1, 1);
    battery.body.angularVelocity = 1;
    battery.body.collideWorldBounds = true;

    this.setBatteryColliders();
  }

  // Spawn a shield in space randomly (time interval set on stopwatch)
  spawnShield() {
    const position = this.randomiseInitialPos();
    const velocity = this.randomiseInitialVelocity(50);

    // Add the sprite
    const shield = this.physics.add.sprite(position.xx, position.yy, "shield");
    Align.scaleToGameWidth(shield, 0.1);
    this.shieldGroup.add(shield);

    // Set the interaction collision of the battery
    shield.body.setVelocity(velocity.x, velocity.y);
    shield.body.bounce.setTo(1, 1);
    shield.body.angularVelocity = 0.5;
    shield.body.collideWorldBounds = true;

    this.setShieldGroupColliders();
  }

  // Generate 12 asteroids if all asteroids have exploded
  spawnAsteroids() {
    /**
     * Add a bunch of sprites into the group
     * frameQuantity is the amount to be spawned per frame
     */
    if (this.asteroidGroup.getChildren().length === 0) {
      this.asteroidGroup = this.physics.add.group({
        key: "rocks",
        frame: [0, 1, 2],
        frameQuantity: 4,
        bounceX: 1,
        bounceY: 1,
        angularVelocity: 1,
        collideWorldBounds: true
      });

      // Randomise every group node's x and y in the whole background
      this.asteroidGroup.children.iterate(
        function(child) {
          // Randomise spawn of asteroids anywhere in the field
          const xx = Math.floor(Math.random() * this.background.displayWidth);
          const yy = Math.floor(Math.random() * this.background.displayHeight);
          child.x = xx;
          child.y = yy;
          Align.scaleToGameWidth(child, 0.1);

          const velocity = this.randomiseInitialVelocity(200);

          child.body.setVelocity(velocity.x, velocity.y);
        }.bind(this)
      );

      this.setRockColliders();
    }
  }

  spawnWormhole() {
    const xx = Math.floor(Math.random() * this.background.displayWidth);
    const yy = Math.floor(Math.random() * this.background.displayHeight);
    const velocity = this.randomiseInitialVelocity(1);

    this.wormhole = this.physics.add.sprite(xx, yy, "wormhole");
    Align.scaleToGameWidth(this.wormhole, 0.4);
    this.trueWormholeScale = this.wormhole.scaleX;
    this.wormhole.body.bounce.setTo(1, 1);
    this.wormhole.body.setVelocity(velocity.x, velocity.y);
    this.wormhole.body.collideWorldBounds = true;

    this.wormholeIsShrinking = false;
    this.wormholeIsGrowing = false;
    this.wormholeHasEntered = false;

    this.wormholeGroup.add(this.wormhole);
  }

  openWormhole() {
    const xx = Math.floor(Math.random() * this.background.displayWidth);
    const yy = Math.floor(Math.random() * this.background.displayHeight);
    const velocity = this.randomiseInitialVelocity(1);

    this.wormhole = this.physics.add.sprite(xx, yy, "wormhole");
    Align.scaleToGameWidth(this.wormhole, 0);
    this.wormhole.body.bounce.setTo(1, 1);
    this.wormhole.body.setVelocity(velocity.x, velocity.y);
    this.wormhole.body.collideWorldBounds = true;

    this.wormholeIsShrinking = false;
  }

  spawnComet() {
    // Add the sprite
    const xx = Math.floor(this.background.displayWidth);
    const yy = Math.floor(Math.random() * this.background.displayHeight);

    const comet = this.physics.add.sprite(xx, yy, "meteorite");
    Align.scaleToGameWidth(comet, 0.15);
    comet.angle = 35;
    comet.body.angularVelocity = 1;
    comet.body.setVelocity(-150, Math.random() * 100);
  }

  // Generate a succession of 35 meteors with .4s arrival difference
  meteorShower() {
    // Callback
    for (let i = 0; i < 35; i++) {
      this.time.delayedCall(i * 400, this.spawnMeteor, [], this);
    }
  }

  // Create one meteor
  spawnMeteor() {
    // All meteors will arrive from the right, going to the left
    const xx = Math.floor(this.background.displayWidth);
    const yy = Math.floor(Math.random() * this.background.displayHeight);

    // Add the sprite
    const meteor = this.physics.add.sprite(xx, yy, "meteor");
    Align.scaleToGameWidth(meteor, 0.2);
    this.meteorGroup.add(meteor);

    // Set the interaction collision of the meteor
    meteor.body.setVelocity(-230, Math.random() * 100);
    meteor.angle = 135;
    meteor.body.bounce.setTo(1, 1);
    meteor.body.angularVelocity = 1;
    meteor.body.collideWorldBounds = false;

    // Sounds and collisions
    emitter.emit(G.PLAY_METEOR_SOUND, "meteor");
    this.setMeteorColliders();
  }

  /**
   * ----------------
   * Collisions
   * ----------------
   */

  setColliders() {
    // Ships
    this.physics.add.collider(
      this.ship,
      this.eship,
      this.lungingDamage,
      null,
      this
    );

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
      this.shotPlayer,
      null,
      this
    );
  }

  setStarColliders() {
    this.physics.add.collider(this.starGroup);
    this.physics.add.collider(this.starGroup, this.asteroidGroup);

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
    this.physics.add.collider(this.batteryGroup, this.asteroidGroup);
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
      this.asteroidGroup,
      this.shield,
      this.destroyObject,
      null,
      this
    );

    this.physics.add.collider(
      this.shield,
      this.eBulletGroup,
      this.destroyObject,
      null,
      this
    );
  }

  setShieldGroupColliders() {
    this.physics.add.collider(this.shieldGroup, this.eship);
    this.physics.add.collider(this.shieldGroup, this.asteroidGroup);
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

  setMeteorColliders() {
    this.physics.add.collider(this.meteorGroup);
    this.physics.add.collider(
      this.meteorGroup,
      this.ship,
      this.shipHitByMeteor,
      null,
      this
    );
    this.physics.add.collider(
      this.meteorGroup,
      this.eship,
      this.destroyObject,
      null,
      this
    );
  }

  annihilateObject(blackHole, object) {
    let objectAngle = this.physics.moveTo(
      object,
      blackHole.x,
      blackHole.y,
      150
    );
    objectAngle = this.toDegrees(objectAngle);
    object.angle = objectAngle;
    object.alpha -= 0.05;

    if (object.alpha === 0) {
      object.destroy();
    }
  }

  superSlowShip(blackHole, ship) {
    console.log(blackHole.x - ship.x);
  }

  // Create colliders for rocks
  setRockColliders() {
    this.physics.add.collider(this.asteroidGroup);

    this.physics.add.collider(
      this.asteroidGroup,
      this.ship,
      this.rockHitPlayer,
      null,
      this
    );
    this.physics.add.collider(
      this.asteroidGroup,
      this.eship,
      this.rockHitEnemy,
      null,
      this
    );

    // Rocks + bullets
    this.physics.add.collider(
      this.asteroidGroup,
      this.bulletGroup,
      this.destroyAsteroidAndBullet,
      null,
      this
    );
    this.physics.add.collider(
      this.asteroidGroup,
      this.eBulletGroup,
      this.destroyAsteroidAndBullet,
      null,
      this
    );
  }

  makeInfo() {
    // Health Bar of the ship player
    this.playerHealthBar = new HealthBar({
      scene: this,
      x: this.ship.x - 35,
      y: this.ship.y - 50,
      width: this.totalPlayerLife,
      height: 7
    });

    // Health Bar of the mothership
    this.mothershipHealthBar = new HealthBar({
      scene: this,
      x: this.eship.x - 35,
      y: this.eship.y - 50,
      width: this.totalEnemyLife,
      height: 7
    });

    // this.playerHPText = this.add.text(
    //   0,
    //   0,
    //   "Your Ship\n" + this.totalPlayerLife,
    //   {
    //     align: "center",
    //     fontFamily: "Varela Round",
    //     fontSize: game.config.width / 30,
    //     backgroundColor: "rgba(0, 0, 0, 0.5)"
    //   }
    // );
    // this.enemyHPText = this.add.text(0, 0, "Mothership\n120", {
    //   align: "center",
    //   fontFamily: "Varela Round",
    //   fontSize: game.config.width / 30,
    //   backgroundColor: "rgba(0, 0, 0, 0.5)"
    // });

    this.gameTimerText = this.add.text(0, 0, "00:00", {
      align: "center",
      fontFamily: "Varela Round",
      fontSize: game.config.width / 25,
      backgroundColor: "rgba(0, 0, 0, 0.5)"
    });

    // this.playerHPText.setOrigin(0.5, 0.5);
    // this.enemyHPText.setOrigin(0.5, 0.5);
    this.gameTimerText.setOrigin(0.5, 0.5);

    this.uiGrid = new AlignGrid({ scene: this, rows: 11, cols: 11 });
    // this.uiGrid.showNumbers();

    // this.uiGrid.placeAtIndex(2, this.playerHPText);
    // this.uiGrid.placeAtIndex(9, this.enemyHPText);
    this.uiGrid.placeAtIndex(5, this.gameTimerText);

    // Icons of the ships
    // this.shipIcon = this.add.image(0, 0, "ship");
    // this.mothershipIcon = this.add.image(0, 0, "eship");
    // Align.scaleToGameWidth(this.shipIcon, 0.05);
    // Align.scaleToGameWidth(this.mothershipIcon, 0.05);
    // this.uiGrid.placeAtIndex(0, this.shipIcon);
    // this.uiGrid.placeAtIndex(7, this.mothershipIcon);
    // this.shipIcon.angle = 270;
    // this.mothershipIcon.angle = 270;

    // Fix the position of the texts
    // this.playerHPText.setScrollFactor(0);
    // this.enemyHPText.setScrollFactor(0);
    this.gameTimerText.setScrollFactor(0);
    // this.shipIcon.setScrollFactor(0);
    // this.mothershipIcon.setScrollFactor(0);
  }

  // Display the battery information
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

  // Both the asteroid and bullet will explode upon contact of each other
  destroyAsteroidAndBullet(bullet, rock) {
    bullet.destroy();

    // Asteroid will explode
    const explosion = this.add.sprite(rock.x, rock.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");

    rock.destroy();
    this.spawnAsteroids();
  }

  // Make the object explode (used in meteors on eship, bullets on shield, asteroid in shield)
  destroyObject(objectItCollidedWith, object) {
    object.destroy();

    // Add the sprite image then play the animation
    const explosion = this.add.sprite(object.x, object.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");
  }

  shotPlayer(ship, bullet) {
    const explosion = this.add.sprite(this.ship.x, this.ship.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");
    if (!this.wearingShield) {
      this.playerHP -= 2;
      this.downPlayer();
      bullet.destroy();
    }
  }

  lungingDamage() {
    if (this.mShipIsLunging) {
      this.shipHitByKamikaze();
    }
  }

  shipHitByKamikaze() {
    this.mShipIsLunging = false;
    const explosion = this.add.sprite(this.ship.x, this.ship.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");
    if (!this.wearingShield) {
      this.playerHP -= 5;
      this.downPlayer();
    }
  }

  shipHitByMeteor(ship, meteor) {
    const explosion = this.add.sprite(meteor.x, meteor.y, "exp");
    explosion.play("boom");
    emitter.emit(G.PLAY_SOUND, "explode");

    if (!this.wearingShield) {
      this.playerHP -= 1;
      this.downPlayer();
    }
    meteor.destroy();
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
    const per = Math.floor((this.playerHP / this.totalPlayerLife) * 100);

    // Official
    this.playerHealthBar.setLife(per, this.totalPlayerLife);

    // Unofficial
    // this.playerHPText.setText("Your Ship\n" + this.playerHP);
    if (this.playerHP < 1) {
      model.playerWon = false;
      this.scene.start("SceneOver");
    }
  }

  downEnemy() {
    this.enemyHP -= 1;
    const per = Math.floor((this.enemyHP / this.totalEnemyLife) * 100);
    // Official
    this.mothershipHealthBar.setLife(per, this.totalEnemyLife);
    // this.enemyHPText.setText("Mothership\n" + this.enemyHP);
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

    if (this.seconds % 15 === 0) {
      this.chargeMothership();
    }

    // Spawns a star every 20 seconds
    if (this.seconds % 20 === 0) {
      this.spawnStar();
    }

    // Spawns a star every 25 seconds
    if (this.seconds % 25 === 0) {
      if (this.wormholeGroup.getChildren().length === 0) {
        this.spawnWormhole();
      }
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
      this.meteorShower();
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

    const per = Math.floor((this.playerHP / this.totalPlayerLife) * 100);

    this.playerHealthBar.setLife(per, this.totalPlayerLife);

    // this.playerHPText.setText("Your Ship\n" + this.playerHP);
  }

  obtainBattery(ship, battery) {
    battery.destroy();
    emitter.emit(G.PLAY_BATTERY_SOUND, "battery");
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

  // If the ship and the wormhole overlaps, the ship enters the wormhole
  enterWormhole() {
    this.physics.overlap(
      this.ship,
      this.wormhole,
      this.pullShipToWormhole,
      null,
      this
    );
  }

  pullShipToWormhole() {
    let shipAngle = this.physics.moveTo(
      this.ship,
      this.wormhole.x,
      this.wormhole.y,
      150
    );
    shipAngle = this.toDegrees(shipAngle);
    this.ship.angle = shipAngle;

    // this.playerHealthBar.alpha = 0;

    this.time.delayedCall(500, this.shrinkWormhole, [], this);
  }

  shrinkWormhole() {
    if (!this.wormholeHasEntered) {
      this.wormholeHasEntered = true;
      this.wormholeIsShrinking = true;
    }
  }

  teleportWormhole() {
    if (!this.wormholeIsGrowing) {
      const xx = Math.floor(Math.random() * this.background.displayWidth);
      const yy = Math.floor(Math.random() * this.background.displayHeight);
      this.wormhole.x = xx;
      this.wormhole.y = yy;
      this.ship.x = this.wormhole.x;
      this.ship.y = this.wormhole.y;
      this.ship.alpha = 0;

      this.wormholeIsGrowing = true;
    }
  }

  getTimer() {
    const d = new Date();
    return d.getTime();
  }

  // KEYBOARD CONTROLS
  moveUp() {
    this.ship.setVelocityY(-this.shipVelocity);
    this.ship.angle = 270;
    this.mothershipChase();
  }
  moveDown() {
    this.ship.setVelocityY(this.shipVelocity);
    this.ship.angle = 90;
    this.mothershipChase();
  }
  moveLeft() {
    this.ship.setVelocityX(-this.shipVelocity);
    this.ship.angle = 180;
    this.mothershipChase();
  }
  moveRight() {
    this.ship.setVelocityX(this.shipVelocity);
    this.ship.angle = 0;
    // this.shield.x = this.ship.x;
    // this.shield.y = this.ship.y;
    // this.shield.angle = this.ship.angle;
    this.mothershipChase();
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

        emitter.emit(G.PLAY_TURBO_SOUND, "turbo");

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

      emitter.emit(G.PLAY_SHIELD_SOUND, "shield");

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

  // Fires the enemy bullet every 0.5 seconds
  barrageEnemyBullet() {
    const directionObject = this.getDirectionFromAngle(this.eship.angle);
    const projectileSpeed = 300;

    const eBullet = this.physics.add.sprite(
      this.eship.x,
      this.eship.y,
      "ebullet"
    );
    eBullet.angle = this.eship.angle;
    this.eBulletGroup.add(eBullet);
    eBullet.body.angularVelocity = 1;

    // Set the velocity based on the direction object
    eBullet.body.setVelocity(
      directionObject.tx * projectileSpeed,
      directionObject.ty * projectileSpeed
    );

    emitter.emit(G.PLAY_SOUND, "enemyShoot");
  }

  kamikaze() {
    this.mShipIsLunging = true;

    let enemyAngle = this.physics.moveTo(
      this.eship,
      this.ship.x,
      this.ship.y,
      500
    );
    enemyAngle = this.toDegrees(enemyAngle);
    this.eship.angle = enemyAngle;

    this.time.delayedCall(1500, this.normalizeMothership, [], this);
  }

  chargeMothership() {
    this.mShipIsCharging = true;
    emitter.emit(G.PLAY_CHARGING_SOUND, "charging");
    this.time.delayedCall(2000, this.randomAttack, [], this);
  }

  // Chooses a random attack after charging for 2 seconds
  randomAttack() {
    this.mShipIsCharging = false;
    const x = Math.floor(Math.random() * 2);

    if (this.mShipAttacks === 0) {
      this.tornadoAttack();
    } else {
      if (x === 1) {
        this.tornadoAttack();
      } else {
        this.kamikaze();
      }
    }

    this.mShipAttacks += 1;
  }

  tornadoAttack() {
    this.mShipIsSpinning = true;

    for (let i = 0; i < 25; i++) {
      this.time.delayedCall(i * 80, this.barrageEnemyBullet, [], this);
    }

    this.time.delayedCall(2000, this.normalizeMothership, [], this);
  }

  normalizeMothership() {
    this.mShipIsSpinning = false;
    this.mShipIsLunging = false;
  }

  mothershipChase() {
    if (
      !this.mShipIsCharging &&
      !this.mShipIsSpinning &&
      !this.mShipIsLunging
    ) {
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

  superSlow() {
    // Annihilate asteroids
    this.physics.overlap(
      this.blackHole,
      this.ship,
      this.superSlowShip,
      null,
      this
    );
  }

  annihilate() {
    // Annihilate asteroids
    this.physics.overlap(
      this.blackHole,
      this.asteroidGroup,
      this.annihilateObject,
      null,
      this
    );

    // Annihilate stars
    this.physics.overlap(
      this.blackHole,
      this.starGroup,
      this.annihilateObject,
      null,
      this
    );

    // Annihilate batteries
    this.physics.overlap(
      this.blackHole,
      this.batteryGroup,
      this.annihilateObject,
      null,
      this
    );

    // Annihilate shields
    this.physics.overlap(
      this.blackHole,
      this.shieldGroup,
      this.annihilateObject,
      null,
      this
    );

    // Annihilate bullets
    this.physics.overlap(
      this.blackHole,
      this.bulletGroup,
      this.annihilateObject,
      null,
      this
    );

    // Annihilate bullets
    this.physics.overlap(
      this.blackHole,
      this.meteorGroup,
      this.annihilateObject,
      null,
      this
    );

    // Annihilate bullets
    this.physics.overlap(
      this.blackHole,
      this.eBulletGroup,
      this.annihilateObject,
      null,
      this
    );
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

    // Horizontal & Vertical Controls
    if (cursors.left.isDown) {
      this.moveLeft();
    } else if (cursors.up.isDown) {
      this.moveUp();
    } else if (cursors.down.isDown) {
      this.moveDown();
    } else if (cursors.right.isDown) {
      this.moveRight();
    }

    // Diagonal Controls
    if (cursors.left.isDown && cursors.up.isDown) {
      this.shiftNorthWest();
    } else if (cursors.right.isDown && cursors.up.isDown) {
      this.shiftNorthEast();
    } else if (cursors.right.isDown && cursors.down.isDown) {
      this.shiftSouthEast();
    } else if (cursors.left.isDown && cursors.down.isDown) {
      this.shiftSouthWest();
    }

    // NO LONGER USED: The ship will not move if the click is too close
    let distanceX = Math.abs(this.ship.x - this.targetX);
    let distanceY = Math.abs(this.ship.y - this.targetY);
    let range = 5;
    if (distanceX < 10 && distanceY < 10) {
      this.ship.body.setVelocity(0, 0);
    }

    // Detect proximity between ship and eship; fires bullets if close
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
    if (
      shipDistX < game.config.width / range &&
      shipDistY < game.config.height / range
    ) {
      this.fireEnemyBullet();
    }

    this.blackHole.angle += 1;
    this.wormhole.angle += 2;

    // Slowly grow the black hole
    // this.blackHole.scaleX += 0.0001;
    // this.blackHole.scaleY += 0.0001;

    let blackHoleDistX = Math.abs(this.ship.x - this.blackHole.x);
    let blackHoleDistY = Math.abs(this.ship.y - this.blackHole.y);
    if (blackHoleDistX < 100 && blackHoleDistY < 100) {
      this.shipVelocity = 40;
      this.shipVelocityDiag = 30;
    } else if (!this.stillBoosting) {
      this.shipVelocity = 100;
      this.shipVelocityDiag = 80;
    }

    // Charge mothership
    if (this.mShipIsCharging) {
      this.eship.scale += 0.004;
    } else {
      Align.scaleToGameWidth(this.eship, 0.25);
    }

    // if (this.mShipIsLunging) {
    //   this.kamikaze();
    // }

    if (this.mShipIsSpinning) {
      this.eship.angle += 10;
    }

    // Any object that overlaps with the black hole will be annihilated
    this.annihilate();
    // this.superSlow();

    // Any object that overlaps with the wormhole
    this.enterWormhole();

    // Shrink the wormhole
    if (this.wormholeIsShrinking) {
      this.ship.alpha -= 0.01;

      if (this.wormhole.scaleX > 0 && this.wormhole.scaleY > 0) {
        this.wormhole.scaleX -= 0.002;
        this.wormhole.scaleY -= 0.002;
      } else {
        this.wormholeIsShrinking = false;
        this.teleportWormhole();
      }
    }

    if (this.wormholeIsDisappearing) {
      if (this.wormhole.scaleX > 0 && this.wormhole.scaleY > 0) {
        this.wormhole.scaleX -= 0.002;
        this.wormhole.scaleY -= 0.002;
      } else {
        this.wormhole.destroy();
      }
    }

    if (this.wormholeIsGrowing) {
      if (
        this.wormhole.scaleX < this.trueWormholeScale &&
        this.wormhole.scaleY < this.trueWormholeScale
      ) {
        this.wormhole.scaleX += 0.002;
        this.wormhole.scaleY += 0.002;
      } else {
        // this.playerHealthBar.alpha = 1;
        // this.playerHealthBar.x = this.ship.x - 35;
        // this.playerHealthBar.y = this.ship.y - 50;

        this.wormholeIsGrowing = false;
        this.wormholeIsDisappearing = true;
      }

      if (this.ship.alpha < 1) {
        this.ship.alpha += 0.01;
      }
    }

    // Follow ship
    this.playerHealthBar.x = this.ship.x - 35;
    this.playerHealthBar.y = this.ship.y - 50;

    this.mothershipHealthBar.x = this.eship.x - 60;
    this.mothershipHealthBar.y = this.eship.y - 50;
  }
}
