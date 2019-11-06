/**
* File: main.js
* Author: Ken
*
* The configuration of the entire game.
*
* Copyright (C) November 2019, Ken Samonte
 */

let game;
let model;
let emitter;
let G;
let controller;
let config;

window.onload = function () {
  // Looks at navigator.userAgent (built in every browser for detecting mobiles)
  let isMobile = navigator.userAgent.indexOf("Mobile");
  if (isMobile === -1) {
    isMobile = navigator.userAgent.indexOf("Tablet");
  }

  // Desktop or Laptop
  if (isMobile === -1) {
    config = {
      type: Phaser.AUTO,
      width: 480,
      height: 640,
      parent: "game",
      physics: {
        default: "arcade",
        arcade: {
          debug: false
        }
      },
      scene: [SceneLoad, SceneTitle, SceneMain, SceneOver]
    }
  } else {
    config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: "game",
      physics: {
        default: "arcade",
        arcade: {
          debug: false
        }
      },
      scene: [SceneLoad, SceneTitle, SceneMain, SceneOver]
    }
  }

  // Global instances
  G = new Constants();
  model = new Model();
  model.isMobile = isMobile;
  game = new Phaser.Game(config);
}
