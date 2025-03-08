// Step 1: Setup the Canvas and Game UI
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

document.body.style.textAlign = "center";

// UI Elements
const startButton = document.createElement("button");
startButton.innerText = "Start Game";
startButton.style.padding = "10px 20px";
startButton.style.fontSize = "20px";
startButton.style.marginTop = "20px";
document.body.appendChild(startButton);

let gameRunning = false;
let score = 0;

// Background Image
const background = new Image();
background.src = "bg.jpeg"; // Add your own background image

// Player Image
const playerImage = new Image();
playerImage.src = "player.jpeg"; // Add your own player image

// Obstacle Image
const obstacleImage = new Image();
obstacleImage.src = "obstacle.jpeg"; // Add your own obstacle image

// Step 2: Create the Player
const player = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    velocityY: 0,
    gravity: 0.5,
    jumpPower: -10,
    isJumping: false,
};

// Step 3: Create Obstacles
const obstacles = [];
const obstacleSpeed = 5;
function spawnObstacle() {
    if (gameRunning) {
        obstacles.push({ x: canvas.width, y: 320, width: 40, height: 40 });
        setTimeout(spawnObstacle, Math.random() * 2000 + 1000);
    }
}

// Step 4: Handle Jumping
window.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !player.isJumping) {
        player.velocityY = player.jumpPower;
        player.isJumping = true;
    }
});

// Step 5: Update Game Logic
function update() {
    if (!gameRunning) return;

    player.velocityY += player.gravity;
    player.y += player.velocityY;
    if (player.y >= 300) {
        player.y = 300;
        player.isJumping = false;
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacleSpeed;
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
        }

        // Collision Detection
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameRunning = false;
            alert("Game Over! Your Score: " + score);
            location.reload();
        }
    });
}

// Step 6: Draw the Game Elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    obstacles.forEach((obstacle) => {
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

// Step 7: Game Loop
function gameLoop() {
    update();
    draw();
    if (gameRunning) requestAnimationFrame(gameLoop);
}

// Step 8: Start Game on Button Click
startButton.addEventListener("click", () => {
    gameRunning = true;
    score = 0;
    obstacles.length = 0;
    spawnObstacle();
    gameLoop();
    startButton.style.display = "none";
});
