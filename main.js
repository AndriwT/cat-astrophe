const CANVAS_HEIGHT = 700;
const CANVAS_WIDTH = 2000;
const FRAME_RATE = 33.33;
let CAT_SPEED = 30;
const GRAVITY = 1;

const EVENT_TYPES = {
  KEYBOARD_EVENT: "KEYBOARD_EVENT",
};

// ----------------------------------------------------------> KEY MAPPING

const KEY_MAP = {
  Enter: "Enter",
  w: "Jump",
  d: "ArrowRight",
  a: "ArrowLeft",
  space: "Attack",
};

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

// ----------------------------------------------------------> IMAGE CREATIONS

const catImage = new Image();
const houseImage = new Image();
const couchImage = new Image();
const lampImage = new Image();
const paintingImage = new Image();
const frameImage = new Image();
const timeFrameImage = new Image();
const bedImage = new Image();
const paintingBImage = new Image();
const paintingPImage = new Image();
const nightstandImage = new Image();
const plantImage = new Image();
const tvTableImage = new Image();
const tvImage = new Image();
const cabinetsImage = new Image();
const counterImage = new Image();
const fridgeImage = new Image();
const broomImage = new Image();
const bowlImage = new Image();
const sinkImage = new Image();
const toiletImage = new Image();
const showerImage = new Image();
const shelvesOneImage = new Image();
const portraitImage = new Image();
const pencilsImage = new Image();
const shelfTwoImage = new Image();
const shelfThreeImage = new Image();
const decorImage = new Image();
const cerealImage = new Image();
const microwaveImage = new Image();
//
const startBannerImage = new Image();
const winImage = new Image();
const loseImage = new Image();

// ----------------------------------------------------------> WIN/LOSE PARAMETERS

let score = 0;
let timeOut = false;

// ----------------------------------------------------------> TEXT RENDERING FUNCTIONS

const countScore = () => {
  ctx.fillStyle = "teal";
  ctx.font = "50px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Items Destroyed: " + score + "/10", 800, 90);
};

const startMenuText = () => {
  ctx.fillStyle = "teal";
  ctx.font = "27px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Catrina,", 1080, 200);
  ctx.fillText("I'm going to the store.", 1070, 230);
  ctx.fillText("Be a good cat and don't", 1060, 260);
  ctx.fillText("break anything,", 1050, 290);
  ctx.fillText("-Human", 1180, 400);
};

const victoryText = () => {
  ctx.fillStyle = "teal";
  ctx.font = "30px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("WHAAAAT???!!!", 840, 280);
  ctx.fillText("CATRINA!!!!", 840, 330);
  ctx.fillText("I'M KICKING YOU OUT", 820, 380);
  ctx.fillText("GET OUT OF HERE!!!", 810, 420);
};

const gameOverText = () => {
  ctx.fillStyle = "teal";
  ctx.font = "30px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("What is this mess??!!", 840, 280);
  ctx.fillText("Catrina bad cat!", 840, 330);
  ctx.fillText("Very very", 860, 380);
  ctx.fillText("bad cat!!", 840, 420);
};

/// ----------------------------------------------------------> BOUNDARIES

function hasHitBottomBounds(sprite) {
  const bounds = sprite.getGlobalBounds();
  return Math.abs(bounds.y + bounds.height >= CANVAS_HEIGHT - 45);
}

function hasHitLeftBounds(sprite) {
  const bounds = sprite.getGlobalBounds();
  return bounds.x <= 150;
}

function hasHitRightBounds(sprite) {
  const bounds = sprite.getGlobalBounds();
  return Math.abs(bounds.x + bounds.width >= CANVAS_WIDTH - 85);
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

// ----------------------------------------------------------> MAIN SPRITE CLASS

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
    // clamping --->
    if (this.y + this.gravitySpeed + this.height >= CANVAS_HEIGHT - 30) {
      this.y = CANVAS_HEIGHT - 50 - this.height;
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
    super(0, 0, 2000, 700, houseImage);
  }
}

class Cat extends Sprite {
  constructor() {
    super(150, 474, 80, 80, catImage);
  }
}

class Frame extends Sprite {
  constructor() {
    super(345, 79, 1400, 150, frameImage);
  }
}

class TimeFrame extends Sprite {
  constructor() {
    super(400, 160, 0, 45, timeFrameImage);
  }
}

class Furniture extends Sprite {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
    this.destroyed = false;
  }

  destroyS = () => {
    this.width = 70;
    this.height = 40;
    this.y = 500;
    this.img.src = "./images/rubbleS.PNG";
  };
  destroyM = () => {
    this.width = 100;
    this.height = 60;
    this.y = 602;
    this.img.src = "./images/rubbleM.PNG";
  };
  destroyL = () => {
    this.width = 140;
    this.height = 100;
    this.y = 505;
    this.img.src = "./images/rubbleL.PNG";
  };
}

// ----------------------------------------------------------> LOADING IMAGES ONLOAD

window.onload = () => {
  async function startGame() {
    await loadImg(timeFrameImage, "./images/timeframe.PNG");
    await loadImg(frameImage, "./images/frame.PNG");
    await loadImg(houseImage, "./images/house.PNG");
    await loadImg(catImage, "./images/cat.png");
    await loadImg(couchImage, "./images/couch.png");
    await loadImg(lampImage, "./images/lamp.PNG");
    await loadImg(paintingImage, "./images/painting.PNG");
    await loadImg(bedImage, "./images/bed.PNG");
    await loadImg(paintingBImage, "./images/painting-blue.PNG");
    await loadImg(paintingPImage, "./images/painting-pink.PNG");
    await loadImg(nightstandImage, "./images/nightstand.PNG");
    await loadImg(plantImage, "./images/plant.PNG");
    await loadImg(tvTableImage, "./images/tv-table.PNG");
    await loadImg(tvImage, "./images/tv.PNG");
    await loadImg(cabinetsImage, "./images/top-cabinets.PNG");
    await loadImg(counterImage, "./images/counter.PNG");
    await loadImg(fridgeImage, "./images/fridge.PNG");
    await loadImg(broomImage, "./images/broom.PNG");
    await loadImg(bowlImage, "./images/food-bowl.PNG");
    await loadImg(sinkImage, "./images/sink.PNG");
    await loadImg(toiletImage, "./images/toilet.PNG");
    await loadImg(showerImage, "./images/shower.PNG");
    await loadImg(shelvesOneImage, "./images/shelves1.PNG");
    await loadImg(portraitImage, "./images/portrait.PNG");
    await loadImg(pencilsImage, "./images/pencils.PNG");
    await loadImg(shelfTwoImage, "./images/shelf2.PNG");
    await loadImg(shelfThreeImage, "./images/shelf3.PNG");
    await loadImg(decorImage, "./images/decor.PNG");
    await loadImg(cerealImage, "./images/cereal.PNG");
    await loadImg(microwaveImage, "./images/microwave.PNG");
    //
    await loadImg(startBannerImage, "./images/start.PNG");
    await loadImg(winImage, "./images/win.PNG");
    await loadImg(loseImage, "./images/lose.PNG");
    const game = new GameOrigin();
  }
  startGame();
};

// ------------------------------------------> HOUSE LEVEL CLASS - OBJECTS DEFINITIONS, DRAW, DESTROY, APPLY GRAVITY

class HouseState {
  _gameData;
  _house;
  _cat;
  _couch;
  _lamp;
  _painting;
  _bed;
  _paintingB;
  _paintingP;
  _nightstand;
  _plant;
  _tvTable;
  _tv;
  _counter;
  _fridge;
  _broom;
  _bowl;
  _cabinets;
  _sink;
  _toilet;
  _shower;
  _shelvesOne;
  _portrait;
  _pencils;
  _shelfTwo;
  _shelfThree;
  _decor;
  _cereal;
  _microwave;

  _jumpsCount = 0;
  _catDirection = 1;

  constructor(gameData) {
    this._gameData = gameData;

    this._cat = new Cat();
    this._house = new House();
    this._couch = new Furniture(180, 540, 120, 120, couchImage);
    this._lamp = new Furniture(290, 450, 90, 210, lampImage);
    this._painting = new Furniture(180, 400, 120, 110, paintingImage);
    this._bed = new Furniture(380, 540, 190, 120, bedImage);
    this._paintingB = new Furniture(380, 380, 65, 75, paintingBImage);
    this._paintingP = new Furniture(450, 430, 65, 75, paintingPImage);
    this._nightstand = new Furniture(580, 595, 60, 65, nightstandImage);
    this._plant = new Furniture(635, 515, 95, 145, plantImage);
    this._tvTable = new Furniture(730, 595, 130, 65, tvTableImage);
    this._tv = new Furniture(730, 506, 130, 90, tvImage);
    this._cabinets = new Furniture(883, 350, 165, 80, cabinetsImage);
    this._counter = new Furniture(883, 520, 280, 140, counterImage);
    this._fridge = new Furniture(1150, 405, 115, 255, fridgeImage);
    this._broom = new Furniture(1280, 480, 60, 180, broomImage);
    this._bowl = new Furniture(1210, 620, 75, 40, bowlImage);
    this._sink = new Furniture(1490, 530, 90, 130, sinkImage);
    this._toilet = new Furniture(1640, 540, 90, 120, toiletImage);
    this._shower = new Furniture(1800, 389, 130, 270, showerImage);
    this._shelvesOne = new Furniture(690, 430, 190, 45, shelvesOneImage);
    this._portrait = new Furniture(700, 398, 50, 55, portraitImage);
    this._pencils = new Furniture(825, 335, 45, 95, pencilsImage);
    this._shelfTwo = new Furniture(1050, 417, 100, 25, shelfTwoImage);
    this._shelfThree = new Furniture(1600, 425, 180, 25, shelfThreeImage);
    this._decor = new Furniture(1610, 365, 160, 60, decorImage);
    this._cereal = new Furniture(1060, 337, 80, 80, cerealImage);
    this._microwave = new Furniture(1040, 495, 100, 60, microwaveImage);
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
        this._jumpsCount++;
        this._cat.move(0, -170);
      }

      // -------------------------------------------------------------------> DESTROYING OBJECTS
      if (
        event.key === KEY_MAP.space &&
        checkSpriteContact(this._cat, this._lamp) &&
        !this._lamp.destroyed
      ) {
        this._lamp.destroyL();
        this._lamp.destroyed = true;
        score++;
      }
      if (
        event.key === KEY_MAP.space &&
        checkSpriteContact(this._cat, this._painting) &&
        !this._painting.destroyed
      ) {
        this._painting.destroyM();
        this._painting.destroyed = true;
        score++;
      }
      if (
        event.key === KEY_MAP.space &&
        checkSpriteContact(this._cat, this._plant) &&
        !this._plant.destroyed
      ) {
        this._plant.destroyM();
        this._plant.destroyed = true;
        this._plant.y -= 80;
        score++;
      }
      if (
        event.key === KEY_MAP.space &&
        checkSpriteContact(this._cat, this._tv) &&
        !this._tv.destroyed
      ) {
        this._tv.destroyL();
        this._tv.destroyed = true;
        this._tv.y -= 10;
        score++;
      }
      if (
        event.key === KEY_MAP.space &&
        checkSpriteContact(this._cat, this._microwave) &&
        !this._microwave.destroyed
      ) {
        this._microwave.destroyM();
        this._microwave.destroyed = true;
        this._microwave.y -= 105;
        score++;
      }
      if (
        event.key === KEY_MAP.space &&
        checkSpriteContact(this._cat, this._portrait) &&
        !this._portrait.destroyed
      ) {
        this._portrait.destroyS();
        this._portrait.destroyed = true;
        this._portrait.y -= 87;
        score++;
      }
      if (
        event.key === KEY_MAP.space &&
        checkSpriteContact(this._cat, this._paintingP) &&
        !this._paintingP.destroyed
      ) {
        this._paintingP.destroyS();
        this._paintingP.destroyed = true;
        score++;
      }
      if (
        event.key === KEY_MAP.space &&
        checkSpriteContact(this._cat, this._broom) &&
        !this._broom.destroyed
      ) {
        this._broom.destroyS();
        this._broom.destroyed = true;
        score++;
      }
      if (
        event.key === KEY_MAP.space &&
        checkSpriteContact(this._cat, this._toilet) &&
        !this._toilet.destroyed
      ) {
        this._toilet.destroyL();
        this._toilet.destroyed = true;
        score++;
      }
      if (
        event.key === KEY_MAP.space &&
        checkSpriteContact(this._cat, this._sink) &&
        !this._sink.destroyed
      ) {
        this._sink.destroyM();
        this._sink.destroyed = true;
        this._sink.y -= 80;
        score++;
      }
    }

    this._gameData.queue.splice(0, 1);
  };

  update = () => {
    if (timeOut === true) {
      // ----------------------------------------------> CHANGE STATE TO GAME OVER
      const gameOver = new GameOver(this._gameData);
      this._gameData.state.updateState(gameOver);
    }

    if (score === 10) {
      // ----------------------------> CHANGING THE AMOUNT OF OBJECTS DESTROYED TO WIN
      // ----------------------------------------------> CHANGE STATE TO VICTORY
      const victory = new Victory(this._gameData);
      this._gameData.state.updateState(victory);
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
    if (!hasHitBottomBounds(this._bed)) {
      this._bed.applyGravity();
    }
    if (!hasHitBottomBounds(this._plant)) {
      this._plant.applyGravity();
    }
    if (!hasHitBottomBounds(this._toilet)) {
      this._toilet.applyGravity();
    }
    if (!hasHitBottomBounds(this._broom)) {
      this._broom.applyGravity();
    }
    if (!hasHitBottomBounds(this._sink)) {
      this._sink.applyGravity();
    }

    this._gameData.stats();
  };

  draw = () => {
    this._house.draw();
    this._couch.draw();
    this._lamp.draw();
    this._painting.draw();
    this._bed.draw();
    this._paintingB.draw();
    this._paintingP.draw();
    this._nightstand.draw();
    this._plant.draw();
    this._tvTable.draw();
    this._tv.draw();
    this._cabinets.draw();
    this._counter.draw();
    this._fridge.draw();
    this._broom.draw();
    this._bowl.draw();
    this._sink.draw();
    this._toilet.draw();
    this._shower.draw();
    this._shelvesOne.draw();
    this._portrait.draw();
    this._pencils.draw();
    this._shelfTwo.draw();
    this._shelfThree.draw();
    this._decor.draw();
    this._cereal.draw();
    this._microwave.draw();
    //
    this._gameData._frame.draw();
    this._gameData._timeFrame.draw();
    //
    this._cat.draw();
  };
}

// ----------------------------------------------------------------> START MENU CLASS

class StartMenu {
  _gameData;
  _startBanner;
  constructor(gameData) {
    this._gameData = gameData;
    //
    this._startBanner = new Furniture(400, 0, 1200, 700, startBannerImage);
  }

  handleInput = () => {
    const event = this._gameData.queue[0];

    if (!event) return;

    if (event.key === KEY_MAP.Enter) {
      const houseState = new HouseState(this._gameData);
      this._gameData.state.updateState(houseState);
    }
    this._gameData.queue.splice(0, 1);
  };
  update = () => {};
  draw = () => {
    this._startBanner.draw();
    startMenuText();
  };
}
// ---------------------------------------------------> VICTORY CLASS
class Victory {
  _gameData;
  constructor(gameData) {
    this._gameData = gameData;
    //
    this._winBanner = new Furniture(400, 0, 1200, 700, winImage);
  }

  handleInput = () => {};
  update = () => {};
  draw = () => {
    this._winBanner.draw();
    victoryText();
  };
}
// -------------------------------------------------> GAME OVER CLASS
class GameOver {
  _gameData;
  _loseBanner;
  constructor(gameData) {
    this._gameData = gameData;
    //
    this._loseBanner = new Furniture(400, 0, 1200, 700, loseImage);
  }

  handleInput = () => {};
  update = () => {};
  draw = () => {
    this._loseBanner.draw();
    gameOverText();
  };
}

// ---------------------------------------------------------------------> GAME MAIN RUNNER

class GameOrigin {
  _frame;
  _timeFrame;

  _gameData = {
    _timeFrame: new Frame(),
    _frame: new TimeFrame(),

    stats: function () {
      this._frame.width += 2; // -------------------------------------> CHANGING THE TIME OF THE HUMAN GETTING HOME
      if (this._frame.width >= 1300) {
        timeOut = true;
      }
    },
    state: new State(),
    queue: [],
  };
  constructor() {
    const startGame = new StartMenu(this._gameData);
    this._gameData.state.updateState(startGame);
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
      countScore();
      this._gameData.state.getActiveState().handleInput();
      this._gameData.state.getActiveState().update();
      this._gameData.state.getActiveState().draw();
    }, FRAME_RATE);
  };
}

//---------------------------------------------------------------------------> STATE

class State {
  _currentState;

  updateState = (newState) => {
    this._currentState = newState;
  };

  getActiveState = () => {
    return this._currentState;
  };
}
