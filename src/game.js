import {
  init,
  initKeys,
  initPointer,
  load,
  onKey,
  GameLoop,
  dataAssets,
} from "kontra";
import Scene from "./scene.js";

import { backgroundSpriteTiles, spriteTiles } from "./tilesets.js";
import { assetsToLoad, directionMapper } from "./constants.js";

class Game {
  constructor() {
    this.currentScene = null;
  }

  initGame = async () => {
    init();
    initKeys();
    initPointer();

    this.addEventListeners();

    dataAssets[new URL("m13e", location.href).href] = spriteTiles;
    dataAssets[new URL("m13e-bg", location.href).href] = backgroundSpriteTiles;

    await load(...assetsToLoad);

    this.currentScene = new Scene();
  };

  addEventListeners = () => {
    onKey(
      directionMapper.map(([key]) => key),
      (event) => event.preventDefault()
    );
  };

  start = async () => {
    await this.initGame();

    GameLoop({
      update: this.currentScene.update,
      render: this.currentScene.render,
    }).start();
  };
}
async function connectWallet() {
  try {
    // connect to the ArConnect browser extension
    await window.arweaveWallet.connect(
      // request permissions
      ["ACCESS_ADDRESS", "SIGN_TRANSACTION", "ACCESS_PUBLIC_KEY", "SIGNATURE"]
    );
  } catch (error) {
    alert("You should connect to ArConnect browser extension.");
    return false;
  }

  return true;
}
connectWallet().then((ret) => {
  if (ret) {
    const game = new Game();
    game.start();
  }
});
