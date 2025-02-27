let riverImages = [];
let river2X = 2;
let river2Speed = 1.5;
let bannerHeight = 60;
let otterSpeed = 5;
let hitMessage = "";
let messageTimer = 0;
let hitTimer = 0;
let otter;
let score = 0;
let lives = 3;
let obstacles;
let obstacleSpeed = 2.5;
let spawnRate = 120;
let isPaused = false;
let showInstructions = true;
let gameStarted = false;

// Boundaries for otter movement
let riverTop, riverBottom, riverLeft, riverRight;

// Messages for collisions
const messages = [
  "Oh no! You hit an obstacle!",
  "Oops! That rock came out of nowhere!",
  "Bummer! Try again, you've got this!",
  "Oof! Keep swimming, little otter!",
  "Yikes! That was a close one!",
  "Stay strong! Every otter makes mistakes!"
];

function preload() {
  console.log("Checking if p5.play is loaded...");

  if (typeof loadAnimation !== "function") {
    console.error("🚨 p5.play is NOT properly loaded! Check script order.");
    return;
  }

  console.log("✅ p5.play is successfully loaded!");

  // Load river images
  for (let i = 1; i <= 6; i++) {
    riverImages[i - 1] = loadImage(`Assets/River_layer${i}.png`);
  }

  // Load Otter Animations
  swimIdle = loadAnimation("Assets/lilotter_swim_idle_strip4.png", 4);
  swimMove = loadAnimation("Assets/lilotter_swim_strip4.png", 4);
  swimHurt = loadAnimation("Assets/lilotter_hurt_strip5.png", 5);
  swimDie = loadAnimation("Assets/lilotter_die_strip8.png", 8);
}

function setup() {
  if (typeof drawSprites !== "function") {
    console.error("🚨 p5.play is NOT loaded! Check your script order in the HTML.");
    return;
  }

  console.log("✅ p5.play is loaded correctly!");

  new Canvas(windowWidth * 0.8, windowHeight * 0.8); 

  let riverBase = height * 0.7;
  let riverRange = height * 0.15;
  riverTop = riverBase - riverRange;
  riverBottom = riverBase;
  riverLeft = 20;
  riverRight = width / 2;

  obstacles = new Group(); 
}

function draw() {
  if (showInstructions) {
    displayInstructionScreen();
    return;
  }

  if (!gameStarted) {
    startGame();
    gameStarted = true;
  }

  if (isPaused) {
    displayPauseScreen();
    return;
  }

  background(220);

  // Draw and animate the river
  for (let i = riverImages.length - 1; i >= 0; i--) {
    image(riverImages[i], 0, 0, width, height);
  }

  image(riverImages[1], river2X, 0, width, height);
  image(riverImages[1], river2X + width, 0, width, height);
  river2X -= river2Speed;
  if (river2X <= -width) {
    river2X = 0;
  }

  // Otter Animation & Movement
  if (hitTimer > 0) {
    otter.changeAnimation("hurt");
    hitTimer--;
  } else if (keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW) || keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) ||
             keyIsDown(87) || keyIsDown(83) || keyIsDown(65) || keyIsDown(68)) {
    otter.changeAnimation("swim");
  } else {
    otter.changeAnimation("idle");
  }

  // Otter Movement
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) otter.y -= otterSpeed;
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) otter.y += otterSpeed;
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) otter.x -= otterSpeed;
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) otter.x += otterSpeed;

  otter.y = constrain(otter.y, riverTop, riverBottom - otter.height);
  otter.x = constrain(otter.x, riverLeft, riverRight - otter.width);

  // Spawn obstacles
  if (frameCount % spawnRate === 0) {
    spawnObstacle();
  }

  // Draw all sprites (Otter & Obstacles)
  if (typeof drawSprites === "function") {
    drawSprites();
  } else {
    console.error("🚨 p5.play is not defined! Check your script order.");
  }

  // Draw bottom banner
  fill(100, 0, 50);
  rect(0, height - bannerHeight, width, bannerHeight);

  fill(255);
  textSize(20);
  textAlign(LEFT, CENTER);
  text(`Otters: ${lives}`, 20, height - (bannerHeight / 2));
  textAlign(RIGHT, CENTER);
  text(`Score: ${score}`, width - 20, height - (bannerHeight / 2));
  textAlign(CENTER, CENTER);
  textSize(14);
  text("Press P to Pause", width / 2, height - (bannerHeight / 4));

  if (messageTimer > 0) {
    displayHitMessage();
    messageTimer--;
  }
}

// Instruction Screen
function displayInstructionScreen() {
  background(50, 0, 100);
  fill(255);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("Welcome to Current Course!", width / 2, height * 0.3);
  textSize(20);
  text("An Otter-based game where you dodge obstacles in the river to get home safe!", 
       width / 2, height * 0.4);
  textSize(18);
  text("Press any key or click to start!", width / 2, height * 0.6);
}

// Start Game - Create Otter
function startGame() {
  otter = new Sprite(riverLeft + 50, riverBottom - 30, 64, 64);
  otter.addAnimation("idle", swimIdle);
  otter.addAnimation("swim", swimMove);
  otter.addAnimation("hurt", swimHurt);
  otter.addAnimation("die", swimDie);
  otter.changeAnimation("idle");
}

// Spawn obstacles as p5.play Sprites
function spawnObstacle() {
  let obs = new obstacles.Sprite(width, random(riverTop, riverBottom - 20), 40, 20);
  obs.vel.x = -obstacleSpeed;
  obs.color = "red";
}

// Update obstacles and detect collision
function updateObstacles() {
  obstacles.forEach(obs => {
    if (otter.overlapping(obs)) {
      lives--;
      hitMessage = random(messages);
      messageTimer = 120;
      hitTimer = 60;
      obs.remove();
      checkGameOver();
    }
  });
}

// Check Game Over
function checkGameOver() {
  if (lives <= 0) {
    otter.changeAnimation("die");
    setTimeout(() => {
      score = 0;
      lives = 3;
      obstacles.removeAll();
      otter.changeAnimation("idle");
    }, 2000);
  }
}

// Key Presses & Mouse Click
function keyPressed() {
  if (showInstructions) {
    showInstructions = false;
  } else if (key.toLowerCase() === 'p') {
    isPaused = !isPaused;
  }
}

function mousePressed() {
  if (showInstructions) {
    showInstructions = false;
  }
}
