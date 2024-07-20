const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const highScoreText = document.getElementById("highScore");

//game variables

const gridSize = 20;
let highScore = 0;
let snake = [{ x: 10, y: 10 }];

let food = generateFood();
let dir = "right";
let game_interval;
let gamespeed_delay = 250;
let game_started = false;

function handleKeyPress(event) {
  if (
    (!game_started && event.code === "Space") ||
    (!game_started && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        dir = "up";
        break;
      case "ArrowDown":
        dir = "down";
        break;
      case "ArrowRight":
        dir = "right";
        break;
      case "ArrowLeft":
        dir = "left";
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);

function startGame() {
  game_started = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  game_interval = setInterval(() => {
    draw();
    move();
    checkCollision();
  }, gamespeed_delay);
}

function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}
const createGameElement = (tag, className) => {
  const el = document.createElement(tag);
  el.className = className;
  return el;
};

const drawSnake = () => {
  snake.forEach((pixel) => {
    const snakeEl = createGameElement("div", "snake");
    setPosition(snakeEl, pixel);
    board.appendChild(snakeEl);
  });
};

const drawFood = () => {
  if (game_started) {
    const foodEl = createGameElement("div", "food");
    setPosition(foodEl, food);
    board.appendChild(foodEl);
  }
};

const setPosition = (el, pixel) => {
  el.style.gridColumn = pixel.x;
  el.style.gridRow = pixel.y;
};

function generateFood() {
  let x = Math.floor(Math.random() * gridSize) + 1;
  let y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

function move() {
  const head = { ...snake[0] };
  switch (dir) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
  }
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(game_interval); // clear past interval
    game_interval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gamespeed_delay);
  } else {
    snake.pop();
  }
}

function increaseSpeed() {
  //   console.log(gameSpeedDelay);
  if (gamespeed_delay > 150) {
    gamespeed_delay -= 5;
  } else if (gamespeed_delay > 100) {
    gamespeed_delay -= 3;
  } else if (gamespeed_delay > 50) {
    gamespeed_delay -= 2;
  } else if (gamespeed_delay > 25) {
    gamespeed_delay -= 1;
  }
}

function updateScore() {
  const currScore = snake.length - 1;
  score.innerText = currScore.toString().padStart(3, "0");
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y == snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  dir = "right";
  food = generateFood();
  gamespeed_delay = 200;
  updateScore();
}

function stopGame() {
  clearInterval(game_interval);
  game_started = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

function updateHighScore() {
  const currScore = snake.length - 1;
  if (currScore > highScore) {
    highScore = currScore;
    highScoreText.innerText = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}
