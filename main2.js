const CANVAS_HEIGHT = 550;
const CANVAS_WIDTH = 1100;
const FRAME_RATE = 33.33;
let CAT_SPEED = 15;
// const GRAVITY = 1;

const EVENT_TYPES = {
  KEYBOARD_EVENT: "KEYBOARD_EVENT",
};

// KEY MAPPING ------>

const KEY_MAP = {
  return: "Return",
  w: "Jump",
  d: "ArrowRight",
  a: "ArrowLeft",
  space: "Attack",
};

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const catImage = new Image();
const houseImage = new Image();
const couchImage = new Image();
const lampImage = new Image();
const paintingImage = new Image();
const vaseTableImage = new Image();
const stairsImage = new Image();
const frameImage = new Image();
const timeFrameImage = new Image();

let score = 0;

const countScore = () => {
  ctx.fillStyle = "teal";
  ctx.font = "20px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Items Destroyed: " + score + "/20", 452, 20);
};

// COUNTER ------------>

// BOUNDARIES ---->

function hasHitBottomBounds(sprite) {
  const bounds = sprite.getGlobalBounds();
  return bounds.y + bounds.height >= CANVAS_HEIGHT - 30;
}

function hasHitSpriteTop(spriteOne, spriteTwo) {
  const boundsOne = spriteOne.getGlobalBounds();
  const boundsTwo = spriteTwo.getGlobalBounds();
  if (Math.abs(boundsOne.y + boundsOne.height - boundsTwo.y) < 15) {
    return true;
  } else {
    return false;
  }
}

// function hasHitSecondFloor(sprite) {
//   const bounds = sprite.getGlobalBounds();
//   return bounds.y + bounds.height >= CANVAS_HEIGHT - 100;
// }

function hasHitLeftBounds(sprite) {
  const bounds = sprite.getGlobalBounds();
  return bounds.x <= 90;
}

function hasHitRightBounds(sprite) {
  const bounds = sprite.getGlobalBounds();
  return bounds.x + bounds.width >= CANVAS_WIDTH - 110;
}

function checkSpriteContact(spriteOne, spriteTwo) {
  const spriteOneBounds = spriteOne.getGlobalBounds();
  const spriteTwoBounds = spriteTwo.getGlobalBounds();

  if (
    spriteOneBounds.x >= spriteTwoBounds.x &&
    spriteOneBounds.x <= spriteTwoBounds.x + spriteTwoBounds.width &&
    spriteOneBounds.y >= spriteTwoBounds.y &&
    spriteOneBounds.y <= spriteTwoBounds.y + spriteTwoBounds.height
  ) {
    return true;
  }
  return false;
}

// INITIALIZING CANVAS
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
canvas.style.backgroundColor = "#E2FDFF";

class Sprite {
  constructor(x, y, width, height, img) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = img;
    this.gravitySpeed = 0;
    this.isInAir = false;
  }

  applyGravity = () => {
    this.gravitySpeed++;

    if (this.isInAir === false) {
      return;
    }
    // clamping --->
    if (this.y + this.gravitySpeed + this.height >= CANVAS_HEIGHT - 30) {
      this.y = CANVAS_HEIGHT - 30 - this.height;
      // not clamping ----->
    } else {
      this.y += this.gravitySpeed;
    }
  };

  getGlobalBounds = () => {
    let x = this.x;
    let y = this.y;

    return {
      x: x,
      y: y,
      height: this.height,
      width: this.width,
    };
  };

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  move = (x, y) => {
    this.x += x;
    this.y += y;
  };
}

async function loadImg(image, imagePath) {
  return new Promise((resolve) => {
    image.src = imagePath;
    image.addEventListener("load", () => {
      resolve();
    });
  });
}

class House extends Sprite {
  constructor() {
    super(0, 0, 1100, 550, houseImage);
  }
}

class Cat extends Sprite {
  constructor() {
    super(150, 470, 50, 50, catImage);
  }
}

class Frame extends Sprite {
  constructor() {
    super(215, 10, 665, 70, frameImage);
  }
}

class TimeFrame extends Sprite {
  constructor() {
    super(227, 44, 0, 20, timeFrameImage);
  }
}

class Furniture extends Sprite {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
  }

  destroyS = () => {
    this.img.src = "./images/rubbleS.PNG";
    this.width = 100;
    this.height = 80;
  };
  destroyM = () => {
    this.img.src = "./images/rubbleM.PNG";
    this.width = 60;
    this.height = 40;
    this.y = 480;
  };
  destroyL = () => {
    this.img.src = "./images/rubbleL.PNG";
    this.width = 100;
    this.height = 80;
  };
}

window.onload = () => {
  async function startGame() {
    await loadImg(timeFrameImage, "./images/timeframe.PNG");
    await loadImg(frameImage, "./images/frame.PNG");
    await loadImg(houseImage, "./images/house-bg.PNG");
    await loadImg(catImage, "./images/cat.png");
    await loadImg(couchImage, "./images/couch.png");
    await loadImg(lampImage, "./images/lamp.PNG");
    await loadImg(paintingImage, "./images/painting.PNG");
    await loadImg(vaseTableImage, "./images/vase-table.PNG");
    await loadImg(stairsImage, "./images/stairs.PNG");
    const game = new Game();
  }
  startGame();
};

class GameState {
  _gameData;
  _house;
  _cat;
  _couch;
  _lamp;
  _painting;
  _vaseTable;
  _stairs;
  _frame;
  _timeFrame;

  _jumpsCount = 0;
  _catDirection = 1;

  constructor(gameData) {
    this._gameData = gameData;

    this._timeFrame = new Frame();
    this._frame = new TimeFrame();
    this._cat = new Cat();
    this._house = new House();
    this._stairs = new Furniture(504, 305, 182, 215, stairsImage);
    this._couch = new Furniture(120, 451, 80, 70, couchImage);
    this._lamp = new Furniture(210, 360, 60, 160, lampImage);
    this._painting = new Furniture(120, 350, 80, 70, paintingImage);
    this._vaseTable = new Furniture(270, 470, 50, 50, vaseTableImage);
  }

  handleInput = () => {
    const event = this._gameData.queue[0];
    const movement = CAT_SPEED * this._catDirection;
    if (!event) return;

    if (event.type === EVENT_TYPES.KEYBOARD_EVENT) {
      if (event.key === KEY_MAP.d) {
        if (!hasHitRightBounds(this._cat)) {
          this._cat.move(movement, 0);
        }
      }
      if (event.key === KEY_MAP.a) {
        if (!hasHitLeftBounds(this._cat)) {
          this._cat.move(-movement, 0);
        }
      }
      if (event.key === KEY_MAP.w && this._jumpsCount < 1) {
        this._cat.isInAir = true;
        this._jumpsCount++;
        this._cat.move(0, -110);
      }
      // if (
      //   event.key === KEY_MAP.d &&
      //   event.key === KEY_MAP.w &&
      //   checkSpriteContact(this._cat, this._stairs)
      // ) {
      //   this._cat.move(160, -250);
      // }

      // DESTROYING OBJECTS ------->
      if (
        event.key === KEY_MAP.space &&
        checkSpriteContact(this._cat, this._lamp)
      ) {
        this._lamp.destroyL();
        score++;
      }
      if (
        event.key === KEY_MAP.space &&
        checkSpriteContact(this._cat, this._painting)
      ) {
        this._painting.destroyM();
        score++;
      }
    }

    this._gameData.queue.splice(0, 1);
  };

  update = () => {
    this._frame.width += 0;
    if (this._frame.width === 645) {
      this._frame.width = 0;
      console.log("GAME OVER");
    }
    if (!hasHitBottomBounds(this._cat)) {
      this._cat.applyGravity();
    }
    if (hasHitBottomBounds(this._cat)) {
      this._cat.gravitySpeed = 0;
      this._jumpsCount = 0;
    }
    if (hasHitLeftBounds(this._cat)) {
      this._cat.move(0, 0);
    }
    if (!hasHitBottomBounds(this._couch)) {
      this._couch.applyGravity();
    }
    if (!hasHitBottomBounds(this._lamp)) {
      this._lamp.applyGravity();
    }
    if (hasHitSpriteTop(this._cat, this._vaseTable)) {
      this._cat.isInAir = false;
      this._jumpsCount = 0;
    }
  };

  draw = () => {
    this._house.draw();
    this._stairs.draw();
    this._couch.draw();
    this._lamp.draw();
    this._painting.draw();
    this._vaseTable.draw();
    this._frame.draw();
    this._timeFrame.draw();
    this._cat.draw();
  };
}

class State {
  _currentState;

  updateState = (newState) => {
    this._currentState = newState;
  };

  getActiveState = () => {
    return this._currentState;
  };
}

class Game {
  _gameData = {
    state: new State(),
    queue: [],
  };
  constructor() {
    const gameState = new GameState(this._gameData);
    this._gameData.state.updateState(gameState);
    this.run();
  }

  handleKeyDown = (event) => {
    let { key } = event;

    if (key === " ") {
      key = "space";
    }
    const keyValue = KEY_MAP[key];

    if (!keyValue) return;

    this._gameData.queue.push({
      type: EVENT_TYPES.KEYBOARD_EVENT,
      key: keyValue,
    });
  };

  initEventListeners = () => {
    window.addEventListener("keydown", this.handleKeyDown);
  };

  run = () => {
    this.initEventListeners();
    setInterval(() => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      this._gameData.state.getActiveState().handleInput();
      this._gameData.state.getActiveState().update();
      this._gameData.state.getActiveState().draw();
      countScore();
    }, FRAME_RATE);
  };
}

//-Create additional boundaries
//-diagonal or arc jumping
//-Flipping image based on direction
//-create main screen (start)
//-create GAME OVER screen ---> maybe animation of human getting home
//-create WIN screen ----> maybe animation of cat jumping happily
//-

// const game = new Game();

// const background = new Image();
// background.src = "./images/house-bg.PNG";

// Make sure the image is loaded first otherwise nothing will draw.
// window.onload = function () {
//   ctx.drawImage(background, 300, 300, 0, 0);
// ctx.fillRect(0, 0, 300, 300);
// };

// var img = new Image();
// img.src = 'canvas_createpattern.png';
// img.onload = function() {
//   var pattern = ctx.createPattern(img, 'repeat');
//   ctx.fillStyle = pattern;
//   ctx.fillRect(0, 0, 300, 300);
// };
