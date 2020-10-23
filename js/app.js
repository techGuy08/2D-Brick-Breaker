window.addEventListener("load", function () {
  var canvas = document.getElementById("gameCanvas");
  var ctx = canvas.getContext("2d");
  var x = canvas.width / 2;
  var y = (canvas.height / 3) * 2;
  var ballRadius = 10;
  var dx = 2;
  var dy = -2;
  var paddleHeight = 10;
  var paddleWidth = 75;
  var paddleX = canvas.width / 2 - paddleWidth / 2;
  var paddleSpeed = 7;
  var rightPressed = false;
  var leftPressed = false;
  var brickRowCount = 3;
  var brickColumnCount = 6;
  var brickWidth = 75;
  var brickHeight = 20;
  var brickPadding = 10;
  var brickOffsetTop = 30;
  var brickOffsetLeft = 38;
  var gamePause = false;
  var score = 0;
  var level = 1;
  var lives = 3;

  var bricks = [];
  function updateBricksMatrix() {
    for (var c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
  }
  updateBricksMatrix();
  function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
    if (e.keyCode === 80) {
      gamePause = !gamePause;
    }
  }
  function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
  }
  function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
  }

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);
  document.addEventListener("mousemove", mouseMoveHandler);

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#f50";
    ctx.fill();
    ctx.closePath();
  }
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#05F";
    ctx.fill();
    ctx.closePath();
  }
  function drawScoreAndLevel() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#444";
    ctx.fillText("Score: " + score, 8, 20);
    ctx.fillText("Level: " + level, canvas.width / 2 - 20, 20);
  }
  function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#444";
    ctx.fillText("Lives: " + lives, canvas.width - 70, 20);
  }
  function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status == 1) {
          var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#10c240";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }
  function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];
        if (b.status == 1) {
          if (
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
          ) {
            dy = -dy;
            b.status = 0;
            score += 2;
            if (bricks.every((row) => row.every((el) => el.status === 0))) {
              level++;
              brickRowCount++;
              if (level === 6) {
                alert(
                  "Congratulations!! you Beat the game! \n Your Score: " + score
                );
                level = 1;
                brickRowCount = 3;
                score = 0;
                lives = 3;
              }
              updateBricksMatrix();
              gameRest();
              draw();
              gamePause = true;
              setTimeout(function () {
                gamePause = false;
              }, 1000);
              // Needed for Chrome to end game
            }
          }
        }
      }
    }
  }

  function draw() {
    if (gamePause) return false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScoreAndLevel();
    drawLives();
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x >= paddleX && x <= paddleX + paddleWidth) {
        dy = -dy;
      } else {
        lives--;
        gameRest();

        if (lives === -1) {
          alert("Game Over");
          brickRowCount = 3;
          lives = 3;
          updateBricksMatrix();
          level = 1;
          score = 0;
        }
        setTimeout(function () {
          draw();
          gamePause = true;
          setTimeout(function () {
            gamePause = false;
          }, 1000);
        }, 10);
      }
    }
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += paddleSpeed;
    }
    if (leftPressed && paddleX > 0) {
      paddleX -= paddleSpeed;
    }
    x += dx;
    y += dy;
  }
  function gameRest() {
    x = canvas.width / 2;
    y = (canvas.height / 3) * 2;
    dx = 2;
    dy = -2;
    paddleX = canvas.width / 2 - paddleWidth / 2;
    rightPressed = false;
    leftPressed = false;
    if (bricks.every((row) => row.every((el) => el.status === 0))) {
      bricks = bricks.map((row) => row.map((el) => ({ ...el, status: 1 })));
    }
  }
  gameRest();
  var update = setInterval(draw, 10);
});
