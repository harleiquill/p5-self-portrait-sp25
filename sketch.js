let canvasWidth, canvasHeight;

// River Background
let riverImage, riverImage2, riverImage3, riverImage4, riverImage5, riverImage6;  
let river2X = 0, river2Speed = 0.5; 

// Game States
let gameState = 0; // 0 = Instructions, 1 = Playing, 2 = Paused, 3 = Game Over
let instBack; // variable to sort out background for instruction screen

// Otter
let otterX, otterY, otterSpeed = 5, otterScale = 1.5;
let otterWidth = 32 * otterScale, otterHeight = 32 * otterScale;
let otterImage;

// Hitbox
let hitboxWidth = otterWidth * 0.6, hitboxHeight = otterHeight * 0.26;

// Obstacles
let logImages = [];
let obstacles = [];
let obstacleHeight = 15;
let obstacleSpeed = 3.5, spawnRate = 90;

//Collision Vars
let hitMessage = ""; // Stores the current hit message
let messageTimer = 0; // Timer for displaying messages

// Game Variables
let score = 0;
let lives = 3;
let fadeAlpha = 255, startFade = false;

// UI
let bannerHeight = 60;
const messages = [
  "Oh no! You hit an obstacle!", 
  "Oops! That one came out of nowhere!",
  "Bummer! Try again, you've got this!", 
  "Oof! Keep swimming, little otter!",
  "Yikes! That was a close one!", 
  "Stay strong! Every otter makes mistakes!"
];

function preload() {
  // Load Background Images
  riverImage = loadImage("Assets/River_layer1.png");  
  riverImage2 = loadImage("Assets/River_layer2.png");  
  riverImage3 = loadImage("Assets/River_layer3.png");
  riverImage4 = loadImage("Assets/River_layer4.png");
  riverImage5 = loadImage("Assets/River_layer5.png");
  riverImage6 = loadImage("Assets/River_layer6.png");
  instBack = loadImage("Assets/otterbackground.png");

  // Load Otter Image
  otterImage = loadImage("Assets/otter_swim1.png");

  // Load Obstacle Images (log0.png - log7.png)
  for (let i = 0; i < 8; i++) {
    logImages.push(loadImage(`Assets/log${i}.png`));
  }
}

function setup() {
  canvasWidth = windowWidth * 0.8;  
  canvasHeight = windowHeight * 0.8;  
  createCanvas(canvasWidth, canvasHeight); 

  let riverBase = canvasHeight * 0.75, riverRange = canvasHeight * 0.3; 
  riverTop = riverBase - riverRange;  
  riverBottom = riverBase;  
  riverLeft = 20; 
  riverRight = canvasWidth / 2; 

  otterX = riverLeft + 50;
  otterY = riverBottom - (riverRange / 2);
}

function draw() {
  background(220);

  if (gameState === 0) {  // INSTRUCTION SCREEN
    image(instBack, 0, 0, canvasWidth, canvasHeight);
    // background(100, 40, 150);
    // Semi-transparent black box behind the text
fill(0, 0, 0, 127); // RGBA — 127 is 50% opacity
noStroke();
let boxWidth = canvasWidth * 0.8;
let boxHeight = canvasHeight * 0.5;
let boxX = (canvasWidth - boxWidth) / 2;
let boxY = canvasHeight * 0.25;

rect(boxX, boxY, boxWidth, boxHeight, 20); // Optional: rounded corners

fill(255);        // white text fill
stroke(0);        // black outline
strokeWeight(2);  // make the outline visible but not too thick

    textSize(30);
    textAlign(CENTER, CENTER);
    text("Welcome to Current Course!", canvasWidth / 2, canvasHeight * 0.3);
    textSize(20);
    text("An Otter-based game where you dodge obstacles!", canvasWidth / 2, canvasHeight * 0.4);
    textSize(18);
    text("Use WASD or Arrow keys to move", canvasWidth / 2, canvasHeight * 0.6);
    textSize(18);
    text("Press any key or click to start!", canvasWidth / 2, canvasHeight * 0.7);

    if (startFade) {
      fadeAlpha -= 5;
      if (fadeAlpha <= 0) gameState = 1;
    }
    return;
  }

  if (gameState === 2) {  // PAUSED SCREEN
    background(0);
    image(instBack, 0, 0, canvasWidth, canvasHeight);
    // Semi-transparent black box behind the text
fill(0, 0, 0, 127); // RGBA — 127 is 50% opacity
noStroke();
let boxWidth = canvasWidth * 0.8;
let boxHeight = canvasHeight * 0.5;
let boxX = (canvasWidth - boxWidth) / 2;
let boxY = canvasHeight * 0.25;

rect(boxX, boxY, boxWidth, boxHeight, 20); // Optional: rounded corners

fill(255);        // white text fill
stroke(0);        // black outline
strokeWeight(2);  // make the outline visible but not too thick

    textSize(30);
    textAlign(CENTER, CENTER);
    text("PAUSED", canvasWidth / 2, canvasHeight * 0.3);
    textSize(24);
    text("Press 'P' to Resume", canvasWidth / 2, canvasHeight * 0.5);
    return;
  }

  if (gameState === 3) {  // GAME OVER SCREEN
    image(instBack, 0, 0, canvasWidth, canvasHeight);
    // Semi-transparent black box behind the text
fill(0, 0, 0, 127); // RGBA — 127 is 50% opacity
noStroke();
let boxWidth = canvasWidth * 0.8;
let boxHeight = canvasHeight * 0.5;
let boxX = (canvasWidth - boxWidth) / 2;
let boxY = canvasHeight * 0.25;

rect(boxX, boxY, boxWidth, boxHeight, 20); // Optional: rounded corners

fill(255);        // white text fill
stroke(0);        // black outline
strokeWeight(2);  // make the outline visible but not too thick

    textSize(30);
    textAlign(CENTER, CENTER);
    text("Aw, little otter, you look pretty tired!", canvasWidth / 2, canvasHeight * 0.3);
    textSize(24);
    text("Let's take a break.", canvasWidth / 2, canvasHeight * 0.4);
    textSize(20);
    text(`Your score this round was: ${score}`, canvasWidth / 2, canvasHeight * 0.5);
    textSize(18);
    text("Press any key to try again.", canvasWidth / 2, canvasHeight * 0.6);
    return;

  }

  // GAMEPLAY (gameState === 1)
  
  // Draw River
  image(riverImage6, 0, 0, canvasWidth, canvasHeight);
  image(riverImage5, 0, 0, canvasWidth, canvasHeight);
  image(riverImage4, 0, 0, canvasWidth, canvasHeight);

  image(riverImage2, river2X, 0, canvasWidth, canvasHeight);
  image(riverImage2, river2X + canvasWidth, 0, canvasWidth, canvasHeight);

  river2X -= river2Speed;
  if (river2X <= -canvasWidth) river2X = 0;

  image(riverImage3, 0, 0, canvasWidth, canvasHeight);
  image(riverImage, 0, 0, canvasWidth, canvasHeight);
    // Display Bottom Banner
    fill(100, 40, 150);
    noStroke();
    rect(0, canvasHeight - bannerHeight, canvasWidth, bannerHeight);

    fill(255);        // white text fill for message in box
    stroke(0);        // black outline
    strokeWeight(2);  // make the outline visible 

    textSize(20);
    textAlign(LEFT, CENTER);
    text(`Otters: ${lives}`, 20, canvasHeight - (bannerHeight / 2));
    textAlign(RIGHT, CENTER);
    text(`Score: ${score}`, canvasWidth - 20, canvasHeight - (bannerHeight / 2));
    textAlign(CENTER, CENTER);
    textSize(14);
    text("Press P to Pause", canvasWidth / 2, canvasHeight - (bannerHeight / 4));
  // Draw Otter
  if (otterImage) image(otterImage, otterX, otterY, otterWidth, otterHeight);
  // DEBUG: Visualize the hitbox by making the box red and slightly transparent fill(255, 0, 0, 150) changed to 255, 0, 0, 0 after the proper location was defined.
  fill(255, 0, 0, 0); // Semi-transparent red -- changed to fully transparent after troubleshooting.
  noStroke();
rect(
  otterX + (otterWidth - hitboxWidth) / 2 - hitboxWidth * 0.1,  // Center horizontally and move slightly to align.
  otterY + (otterHeight - hitboxHeight) / 2 + hitboxHeight * 0.6,  // Move rect down to better align with otter png.
  hitboxWidth,
  hitboxHeight
);


  // Otter Movement
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) otterY -= otterSpeed;
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) otterY += otterSpeed;
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) otterX -= otterSpeed;
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) otterX += otterSpeed;

  otterY = constrain(otterY, riverTop + hitboxHeight / 2 - 20, riverBottom - hitboxHeight / 2 - 40);
  otterX = constrain(otterX, riverLeft, riverRight - hitboxWidth);

  // SPAWN OBSTACLES
  if (frameCount % spawnRate === 0) {
    let obstacleY = random(riverTop, riverBottom - obstacleHeight * 0.9); // Moves spawn area lower based on obstacle height
    let logType = floor(random(0, 8));
    obstacles.push({
      x: canvasWidth,
      y: obstacleY,
      width: 40,
      height: 15,
      img: logImages[logType]
    });
  }

  // Obstacle updates (move the obstacle) and check for collision
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.x -= obstacleSpeed;

    if (obs.img) image(obs.img, obs.x, obs.y, obs.width, obs.height);
    else {
      fill(255, 50, 50);
      rect(obs.x, obs.y, obs.width, obs.height);
    }

    // Define obstacle and otter collision
    if (
      otterX + (otterWidth - hitboxWidth) / 2 < obs.x + obs.width &&
      otterX + hitboxWidth + (otterWidth - hitboxWidth) / 2 > obs.x &&
      otterY + (otterHeight - hitboxHeight) / 2 < obs.y + obs.height &&
      otterY + hitboxHeight + (otterHeight - hitboxHeight) / 2 > obs.y
    ) {
      lives--;
      hitMessage = random(messages);
      messageTimer = 120;
      obstacles.splice(i, 1);
      if (lives <= 0) gameState = 3;
    } else if (obs.x + obs.width < 0) {
      score += 10;
      obstacles.splice(i, 1);
    }

}
// Show hit message if the timer is active
if (messageTimer > 0) {
  // Optional: background box for better visibility
  fill(0, 150); // semi-transparent black
  noStroke();
  rect(canvasWidth / 4, canvasHeight / 1.6, canvasWidth / 2, 120, 10);

  fill(255);        // white text fill
  stroke(0);        // black outline
  strokeWeight(2);  // make the outline visible 

  textSize(24);
  textAlign(CENTER, CENTER);
  text(hitMessage, canvasWidth / 2, canvasHeight / 1.40);
  messageTimer--;
}

    // //Display Hit Message if Active
    // if (messageTimer > 0) {
    //   fill(0);
    //   textSize(30);
    //   textAlign(CENTER, CENTER);
    //   stroke(0);
    //   strokeWeight(2);
    //   fill(255);
    //   text(hitMessage, canvasWidth / 2, canvasHeight / 3);
    //   messageTimer--;
    // }
  }


// Handle Keypress
function keyTyped() {
  if (gameState === 0) { 
    startFade = true;
  } else if (gameState === 1 && key.toLowerCase() === 'p') { 
    gameState = 2;
  } else if (gameState === 2 && key.toLowerCase() === 'p') { 
    gameState = 1;
  } else if (gameState === 3) { 
    gameState = 0;
    lives = 3; // RESET LIVES on restart from gameOver
    score = 0; // RESET SCORE so it's not carried over
    obstacles = []; // CLEAR OBSTACLES
  }
}

// Restart on Click
function mousePressed() {
  if (gameState === 3) {
    gameState = 0; // On gameOver, restart at the instruction screen.
    lives = 3; // RESET LIVES
    score = 0; // RESET SCORE
    hitMessage = "";
    messageTimer = 0;
    obstacles = []; // CLEAR OBSTACLES
  }
  if (gameState === 0) gameState = 1; // From instruction screen, start game.
}
// ack