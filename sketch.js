let canvasWidth, canvasHeight;//Holds the size for canvas to call a % of the screen instead of a set number.
let riverImage, riverImage2, riverImage3, riverImage4, riverImage5, riverImage6;  //Vars for the river background
let river2X = 0; //Number of river images strung together
let river2Speed = 0.5; //Speed the river flows by
let otterX, otterY; //Otter position
let otterWidth = 100, otterHeight = 100; //Defines size of otter as a rect
let frameColor = [50, 0, 100];  
let strokeColor = [192, 192, 192];  
let bannerHeight = 60; //Size of the lower banner with directions and score.
let otterSpeed = 5; //How fast the otter moves in the game
let hitMessage = ""; // Stores the current hit message
let messageTimer = 0; // Timer for displaying messages
let otterImage; //This variable holds the image based on the otter state.
let swimIdle, swimMove, swimHurt, swimDie; //Different otter states.
let hitTimer = 0;//Timer for displaying the "hurt" sprite.
let otter; //Sprite name.


// List of random reassuring messages
const messages = [
  "Oh no! You hit an obstacle!",
  "Oops! That rock came out of nowhere!",
  "Bummer! Try again, you've got this!",
  "Oof! Keep swimming, little otter!",
  "Yikes! That was a close one!",
  "Stay strong! Every otter makes mistakes!"
];

// Game variables
let score = 0;
let lives = 3;
let obstacles = [];
let obstacleSpeed = 3.5;
let spawnRate = 90;

// Game states
let isPaused = false;
let showInstructions = true; // Show instructions at start

// Define movement boundaries
let riverTop, riverBottom, riverLeft, riverRight;

function preload() {
  riverImage = loadImage("Assets/River_layer1.png");  
  riverImage2 = loadImage("Assets/River_layer2.png");  
  riverImage3 = loadImage("Assets/River_layer3.png");
  riverImage4 = loadImage("Assets/River_layer4.png");
  riverImage5 = loadImage("Assets/River_layer5.png");
  riverImage6 = loadImage("Assets/River_layer6.png");

  // Load otter animations
  this.swimIdle = loadAnimation("Assets/lilotter_swim_idle_strip4.png", { frameSize: [64, 64], frames: 4 });
  this.swimMove = loadAnimation("Assets/lilotter_swim_strip4.png", { frameSize: [64, 64], frames: 4 });
  this.swimHurt = loadAnimation("Assets/lilotter_hurt_strip5.png", { frameSize: [64, 64], frames: 5 });
  this.swimDie = loadAnimation("Assets/lilotter_die_strip8.png", { frameSize: [64, 64], frames: 8 });

  otterImage = swimIdle;
}

function setup() {
  canvasWidth = windowWidth * 0.8;  
  canvasHeight = windowHeight * 0.8;  
  createCanvas(canvasWidth, canvasHeight); 

//Define otter boundaries (river)
  let riverBase = canvasHeight * 0.7; 
  let riverRange = canvasHeight * 0.15; 
//Define top/bottom of river
  riverTop = riverBase - riverRange;  
  riverBottom = riverBase;  
//Define left/right boundaries for otter sprite
  riverLeft = 20; 
  riverRight = canvasWidth / 2; 

  //Define otter start location. 
  otterX = riverLeft + 50;
  otterY = riverBottom - (riverRange / 2); 

   // Create Otter Sprite at Correct Position
   otter = new Sprite(riverLeft + 50, riverBottom - 30, 64, 64);
   otter.addAnimation("idle", this.swimIdle);
   otter.addAnimation("swim", this.swimMove);
   otter.addAnimation("hurt", this.swimHurt);
   otter.addAnimation("die", this.swimDie);
   otter.changeAnimation("idle"); // Start in idle animation
}

function draw() {
  background(220);

  // Show Instruction Screen Before Game Starts
  if (showInstructions) {
    displayInstructionScreen();
    return; // Stops game logic until instructions are dismissed
  }

  // Show Pause Screen if Paused
  if (isPaused) {
    displayPauseScreen();
    return; // Stops game logic until unpaused
  }

  // Draw River Background 
  image(riverImage6, 0, 0, canvasWidth, canvasHeight);  
  image(riverImage5, 0, 0, canvasWidth, canvasHeight);
  image(riverImage4, 0, 0, canvasWidth, canvasHeight);

  // Moving River_layer2
  image(riverImage2, river2X, 0, canvasWidth, canvasHeight);
  image(riverImage2, river2X + canvasWidth, 0, canvasWidth, canvasHeight);
  river2X -= river2Speed;
  if (river2X <= -canvasWidth) {
    river2X = 0;
  }
  image(riverImage3, 0, 0, canvasWidth, canvasHeight);
  image(riverImage, 0, 0, canvasWidth, canvasHeight);

  
  // Update Otter Animation Based on Movement & Collision
  if (hitTimer > 0) {
    otter.changeAnimation("hurt");
    hitTimer--;
  } else if (keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW) || keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) ||
             keyIsDown(87) || keyIsDown(83) || keyIsDown(65) || keyIsDown(68)) {  
    otter.changeAnimation("swim");
  } else {
    otter.changeAnimation("idle");
  }

  //Otter is Drawn
  otter.draw();

  // Otter Movement
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {  
    otterY -= otterSpeed; 
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {  
    otterY += otterSpeed; 
  }
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {  
    otterX -= otterSpeed; 
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {  
    otterX += otterSpeed; 
  }

  otterY = constrain(otterY, riverTop, riverBottom - otterHeight); //Defines the otter's Y position
  otterX = constrain(otterX, riverLeft, riverRight - otterWidth);//Defines the otter's X position

  // Draw Otter - this is the old rectangle, commenting out to draw sprite.
  // fill(100, 100, 255); 
  // rect(otterX, otterY, otterWidth, otterHeight);

  // Handle Obstacles
  if (frameCount % spawnRate === 0) {
    spawnObstacle();
  }
  updateObstacles();

  // Draw Bottom Banner
  fill(100, 0, 50);  
  noStroke();
  rect(0, canvasHeight - bannerHeight, canvasWidth, bannerHeight); 

  // Display Score, Lives & Pause Message
  fill(255);  
  textSize(20);
  textAlign(LEFT, CENTER);
  text(`Otters: ${lives}`, 20, canvasHeight - (bannerHeight / 2)); 

  textAlign(RIGHT, CENTER);
  text(`Score: ${score}`, canvasWidth - 20, canvasHeight - (bannerHeight / 2)); 

  textAlign(CENTER, CENTER);
  textSize(14);
  text("Press P to Pause", canvasWidth / 2, canvasHeight - (bannerHeight / 4));
  
  // Display Hit Message (If Active)
  if (messageTimer > 0) {
    displayHitMessage();
    messageTimer--; // Countdown timer
  }

   // Collision Detection
   if (otter.overlaps(obs)) {
    lives -= 1;
    hitMessage = random(messages);
    messageTimer = 120;
    hitTimer = 60;
    obstacles.splice(i, 1);
    checkGameOver();
  } else if (obs.x + obs.width < 0) {
    score += 10;
    obstacles.splice(i, 1);
  }
}

//Determine if the otter is out of lives. Display the death animation.
function checkGameOver() {
  if (lives <= 0) {
    otter.changeAnimation("die");
    setTimeout(resetGame, 2000);
  }
}

//Start game over on death.
function resetGame() {
  score = 0;
  lives = 3;
  obstacles = [];
  otter.changeAnimation("idle");
}

// Instruction Screen
function displayInstructionScreen() {
  background(50, 0, 100); // Dark purple background

  fill(255);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("Welcome to Current Course!", canvasWidth / 2, canvasHeight * 0.3);
  textSize(20);
  text("An Otter-based game where you dodge obstacles in the river to get home safe!", 
       canvasWidth / 2, canvasHeight * 0.4);
  textSize(18);
  text("Press any key or click to start!", canvasWidth / 2, canvasHeight * 0.6);
}

// Pause Screen
function displayPauseScreen() {
  fill(0, 0, 0, 150); // Semi-transparent overlay
  rect(canvasWidth / 4, canvasHeight / 3, canvasWidth / 2, canvasHeight / 4, 20); // Rounded rectangle

  fill(255, 255, 0);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("PAUSED - Press 'P' to Resume", canvasWidth / 2, canvasHeight / 2);
}

// Spawn Obstacles
function spawnObstacle() {
  let obstacleHeight = 15; 
  let obstacleWidth = 40;
  let obstacleY = random(riverTop, riverBottom - obstacleHeight);

  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvasWidth - 150) {
    obstacles.push({ x: canvasWidth, y: obstacleY, width: obstacleWidth, height: obstacleHeight });
  }
}

// Update Obstacles
function updateObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.x -= obstacleSpeed;

    // Draw obstacle
    fill(255, 50, 50);
    rect(obs.x, obs.y, obs.width, obs.height);

    // Collision Detection
    if (collides(otterX, otterY, otterWidth, otterHeight, obs.x, obs.y, obs.width, obs.height)) {
      lives -= 1;
      hitMessage = random(messages); // Pick a random message
      messageTimer = 120; // Display message for 2 seconds (120 frames at 60 FPS)
      obstacles.splice(i, 1);
      checkGameOver();
    } else if (obs.x + obs.width < 0) {
      score += 10;
      obstacles.splice(i, 1);
    }
  }
}

// Collision Detection
function collides(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (
    x1 < x2 + w2 &&
    x1 + w1 > x2 &&
    y1 < y2 + h2 &&
    y1 + h1 > y2
  );
}

// Game Over Check
function checkGameOver() {
  if (lives <= 0) {
    score = 0;
    lives = 3;
    obstacles = [];
  }
}
//Key Press handling - instead of ('p' === or 'P' ===) trying to change all instances of p to lowercase p
function keyTyped() {
  if (showInstructions) {
    showInstructions = false; 
    return; 
  }

  if (key.toLowerCase() === 'p') { // Ensures "P" or "p" works
    isPaused = !isPaused;
  }
}

function mousePressed() {
  if (showInstructions) {
    showInstructions = false;
  }
}
// Function to Display the "Oh No!" Message
function displayHitMessage() {
  fill(0); // Black outline
  textSize(30);
  textAlign(CENTER, CENTER);
  stroke(0); // Black stroke
  strokeWeight(2);
  fill(255); // White text
  text(hitMessage, canvasWidth / 2, canvasHeight / 3);
}