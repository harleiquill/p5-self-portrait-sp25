let canvasWidth, canvasHeight;//Canvas Vars

//River Background Vars
let riverImage, riverImage2, riverImage3, riverImage4, riverImage5, riverImage6;  
let river2X = 0; 
let river2Speed = 0.5; 
// Define movement boundaries
let riverTop, riverBottom, riverLeft, riverRight;

//Otter Vars
let otterX, otterY; 
let otterSpeed = 5; 
let otterFrames = [];
let currentFrame = 0;
let frameDelay = 5;
let frameCounter = 0;
let otterScale = 3;
let otterWidth = 32 * otterScale;
let otterHeight = 32 * otterScale;
let imagesLoaded = true; 

//Collision Vars
let hitMessage = ""; // Stores the current hit message
let messageTimer = 0; // Timer for displaying messages

//UI Vars
let frameColor = [153, 50, 204];  
let strokeColor = [192, 192, 192];  
let bannerHeight = 60;
let purple = frameColor

// Game variables
let score = 0;
let lives = 3;
let obstacles = [];
let obstacleSpeed = 3.5;
let spawnRate = 90;

// Game states
let isPaused = false;
let showInstructions = true; // Show instructions at start

// List of random reassuring messages
const messages = [
  "Oh no! You hit an obstacle!",
  "Oops! That rock came out of nowhere!",
  "Bummer! Try again, you've got this!",
  "Oof! Keep swimming, little otter!",
  "Yikes! That was a close one!",
  "Stay strong! Every otter makes mistakes!"
];






function preload() {
    let loadedCount = 0
    //preload the river background
  riverImage = loadImage("Assets/River_layer1.png");  
  riverImage2 = loadImage("Assets/River_layer2.png");  
  riverImage3 = loadImage("Assets/River_layer3.png");
  riverImage4 = loadImage("Assets/River_layer4.png");
  riverImage5 = loadImage("Assets/River_layer5.png");
  riverImage6 = loadImage("Assets/River_layer6.png");
    // Preload otter animation frames and track load progress
    function checkLoaded() {
        loadedCount++;
        if (loadedCount === 4) {
          imagesLoaded = true;
          console.log("All otter images loaded!"); // Debugging output
        }
      }
    
      otterFrames[0] = loadImage("Assets/otter_swim1.png", checkLoaded);
      otterFrames[1] = loadImage("Assets/otter_swim2.png", checkLoaded);
      otterFrames[2] = loadImage("Assets/otter_swim3.png", checkLoaded);
      otterFrames[3] = loadImage("Assets/otter_swim4.png", checkLoaded);
}

function setup() {
    //Canvas Creation
  canvasWidth = windowWidth * 0.8;  
  canvasHeight = windowHeight * 0.8;  
  createCanvas(canvasWidth, canvasHeight); 

  //River boundaries for otter movement.
  let riverBase = canvasHeight * 0.7; 
  let riverRange = canvasHeight * 0.15; 
  riverTop = riverBase - riverRange;  
  riverBottom = riverBase;  
  riverLeft = 20; 
  riverRight = canvasWidth / 2; 

  //Otter spawn location
  otterX = riverLeft + 50;
  otterY = riverBottom - (riverRange / 2); 
}






function draw() {
    background(220); // Clear screen for next frame
  
    // **Show Instruction Screen Before Game Starts**
    if (showInstructions) {
      displayInstructionScreen();
      return; // Stops game logic until instructions are dismissed
    }
  
    // **Show Pause Screen if Paused**
    if (isPaused) {
      displayPauseScreen();
      return; // Stops game logic until unpaused
    }
  
    // **Game Logic**
    drawBackground();   // Draws and animates the river
    drawOtter();        // Animates and moves the otter
    drawBottomBanner(); // Displays UI elements (score, lives, etc.)
    
    // **Spawn and Update Obstacles**
    if (frameCount % spawnRate === 0) {
      spawnObstacle(); // Spawns new obstacles at intervals
    }
    updateObstacles(); // Moves existing obstacles and checks collisions
  
    // **Display Hit Message if Active**
    if (messageTimer > 0) {
      displayHitMessage();
      messageTimer--; // Decrease timer until message disappears
    }
  }
  
  
  







  // Instruction Screen
function displayInstructionScreen() {
  background(153, 50, 204); // Dark purple background

  FILL(255);
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
    FILL(50, 0, 100, 150);
    rect(canvasWidth / 4, canvasHeight / 3, canvasWidth / 2, canvasHeight / 4, 20);
    FILL(255);
    textSize(30);
    textAlign(CENTER, CENTER);
    text("PAUSED - Press 'P' to Resume", canvasWidth / 2, canvasHeight / 2);
  }
  





  //Spawn obstacles
function spawnObstacle() {
    let obstacleHeight = 15;
    let obstacleWidth = 40;
    let obstacleY = random(riverTop, riverBottom - obstacleHeight);
  
    console.log("Spawning obstacle at:", canvasWidth, obstacleY); // Debugging
  
    obstacles.push({
      x: canvasWidth,
      y: obstacleY,
      width: obstacleWidth,
      height: obstacleHeight
    });
  }
  
  





  //Update Obstacles, to animate.
function updateObstacles() {
    if (isPaused) return; // Stop obstacles when paused
  
    for (let i = obstacles.length - 1; i >= 0; i--) {
      let obs = obstacles[i];
      obs.x -= obstacleSpeed; // Move obstacles left
  
      // Draw obstacle
      FILL(255, 50, 50);
      rect(obs.x, obs.y, obs.width, obs.height);
  
      // **Collision Detection**
      if (collides(otterX, otterY, otterWidth, otterHeight, obs.x, obs.y, obs.width, obs.height)) {
        lives -= 1;
        hitMessage = random(messages);
        messageTimer = 120;
        obstacles.splice(i, 1);
        checkGameOver();
      } else if (obs.x + obs.width < 0) {
        score += 10;
        obstacles.splice(i, 1);
      }
    }
  }
  
  






  //Bottom Banner 
function drawBottomBanner() {
    FILL(153, 50, 204);  // Dark purple color
    noStroke();
    rect(0, canvasHeight - bannerHeight, canvasWidth, bannerHeight); 
  
    // display lives
    FILL(255);  
    textSize(20);
    textAlign(LEFT, CENTER);
    text(`Otters: ${lives}`, 20, canvasHeight - (bannerHeight / 2)); 
  //display score
    textAlign(RIGHT, CENTER);
    text(`Score: ${score}`, canvasWidth - 20, canvasHeight - (bannerHeight / 2)); 
  //display pause help for now, commands soon
    textAlign(CENTER, CENTER);
    textSize(14);
    text("Press P to Pause", canvasWidth / 2, canvasHeight - (bannerHeight / 4));
  }






  // Collision detection system
function collides(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (
    x1 < x2 + w2 &&
    x1 + w1 > x2 &&
    y1 < y2 + h2 &&
    y1 + h1 > y2
  );
}
//This should draw the otter with animated frames.





function drawOtter() {
    if (!imagesLoaded || otterFrames.length === 0) {
      console.log("Otter images not loaded yet!");
      return;
    }
  
    // **Cycle through animation frames**
    frameCounter++;
    if (frameCounter % frameDelay === 0) {
      currentFrame = (currentFrame + 1) % otterFrames.length;
    }
  
    // **Draw the current otter frame**
    image(otterFrames[currentFrame], otterX, otterY, otterWidth, otterHeight);
  
    // **Otter Movement - Only if NOT Paused**
    if (!isPaused) {
      if (keyIsDown(UP_ARROW) || keyIsDown(87)) otterY -= otterSpeed;
      if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) otterY += otterSpeed;
      if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) otterX -= otterSpeed;
      if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) otterX += otterSpeed;
    }
  
    // **Keep the otter inside the river boundaries**
    otterY = constrain(otterY, riverTop, riverBottom - otterHeight);
    otterX = constrain(otterX, riverLeft, riverRight - otterWidth);
  }

  




  //check lives for game reset
function checkGameOver() {
  if (lives <= 0) {
    score = 0;
    lives = 3;
    obstacles = [];
  }
}





//Key Press handling - instead of ('p' === or 'P' ===) trying to change all instances of p to lowercase p
function keyTyped() {
    if (showInstructions === true) {
      showInstructions = false;
      return;
    }
  
    if (key.toLowerCase() === 'p') {
      isPaused = !isPaused;
    }
  }
  




  //detects a click to remove the instructions
function mousePressed() {
  if (showInstructions === true) {
    showInstructions = false;
  }
}




// display the "Oh No!" Message**
function displayHitMessage() {
  FILL(0); // Black outline
  textSize(30);
  textAlign(CENTER, CENTER);
  stroke(0); // Black stroke
  strokeWeight(2);
  FILL(255); // White text
  text(hitMessage, canvasWidth / 2, canvasHeight / 3);
}




function drawBackground() {
    image(riverImage6, 0, 0, canvasWidth, canvasHeight);
    image(riverImage5, 0, 0, canvasWidth, canvasHeight);
    image(riverImage4, 0, 0, canvasWidth, canvasHeight);

    // **Animate the Moving River Layer**
    image(riverImage2, river2X, 0, canvasWidth, canvasHeight);
    image(riverImage2, river2X + canvasWidth, 0, canvasWidth, canvasHeight);

    // **Move the river only if NOT paused**
    if (!isPaused) {
        river2X -= river2Speed;
        if (river2X <= -canvasWidth) {
            river2X = 0; // Reset animation
        }
    }

    image(riverImage3, 0, 0, canvasWidth, canvasHeight);
    image(riverImage, 0, 0, canvasWidth, canvasHeight);
}
