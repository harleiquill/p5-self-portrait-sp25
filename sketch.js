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
let otterScale = 1.5;
let otterWidth = 32 * otterScale;
let otterHeight = 32 * otterScale;
let otterImage ;
let rectWidth = otterWidth / 1.8;  // Use the same scaled width as the otter
let rectHeight = otterHeight / 3;  // Use the same scaled height as the otter
let hitboxWidth = otterWidth * 0.6;  // Reduce width to % of image width
let hitboxHeight = otterHeight * 0.2; // Reduce height to % of image height

//Collision Vars
let hitMessage = ""; // Stores the current hit message
let messageTimer = 0; // Timer for displaying messages

//UI Vars
let frameColor = [100, 40, 150];  
let strokeColor = [192, 192, 192];  
let bannerHeight = 60;
// let purple = frameColor -- this was to fix an error stating "purple" was not defined, realized I forgot to enclose the color name in backticks.

// Game variables
let score = 0;
let lives = 3;
let obstacles = [];
let obstacleSpeed = 3.5;
let spawnRate = 90;

// Game states
let isPaused = false;
let gameOver = false; // Track if the game is over
let showInstructions = true; // Show instructions at start
let fadeAlpha = 255; // Start fully visible
let startFade = false; // Controls when the fade begins

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
  // Preload river background
  riverImage = loadImage("Assets/River_layer1.png");  
  riverImage2 = loadImage("Assets/River_layer2.png");  
  riverImage3 = loadImage("Assets/River_layer3.png");
  riverImage4 = loadImage("Assets/River_layer4.png");
  riverImage5 = loadImage("Assets/River_layer5.png");
  riverImage6 = loadImage("Assets/River_layer6.png");

  // Load a single otter image
  otterImage = loadImage("Assets/otter_swim1.png");
}

function setup() {
    //Canvas Creation
  canvasWidth = windowWidth * 0.8;  
  canvasHeight = windowHeight * 0.8;  
  createCanvas(canvasWidth, canvasHeight); 

  //River boundaries for otter movement.
  let riverBase = canvasHeight * 0.75; 
  let riverRange = canvasHeight * 0.3; 
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
  
// Show Instruction Screen Before Game Starts with a fade effect
if (showInstructions) {
    background(100, 40, 150);

    fill(255, fadeAlpha); // Apply fade effect only when fading
    textSize(30);
    textAlign(CENTER, CENTER);
    text("Welcome to Current Course!", canvasWidth / 2, canvasHeight * 0.3);

    textSize(20);
    text("An Otter-based game where you dodge obstacles!", canvasWidth / 2, canvasHeight * 0.4);

    textSize(18);
    text("Use WASD or Arrow keys to move the otter and dodge the obstacles!", canvasWidth / 2, canvasHeight * 0.6);

    textSize(18);
    text("Press any key or click to start!", canvasWidth / 2, canvasHeight * 0.7);

    // Start fade only if input was detected
    if (startFade) {
      fadeAlpha -= 5; // Adjust for faster/slower fade

      // Once fully faded, exit instruction screen
      if (fadeAlpha <= 0) {
        showInstructions = false;
      }
    }

    return; // Stops game logic until instructions fade out
  }
  
    //Show Pause Screen if Paused
    if (isPaused) {
      background('0, 0, 0');
      fill(100, 40, 150, 150);
      rect(canvasWidth / 4, canvasHeight / 3, canvasWidth / 2, canvasHeight / 4, 20);
      fill(255);
      textSize(30);
      textAlign(CENTER, CENTER);
      text("PAUSED!");
      textSize(24);
      text("Movement keys are WASD or the arrows", canvasWidth / 2, canvasHeight / 2.3);
      text("Press 'P' to Resume", canvasWidth / 2, canvasHeight / 2);
      return;
    }
  
    //Draw River Background Layers in the proper order for layering, Animation of layer 2.
    image(riverImage6, 0, 0, canvasWidth, canvasHeight);
    image(riverImage5, 0, 0, canvasWidth, canvasHeight);
    image(riverImage4, 0, 0, canvasWidth, canvasHeight);
  
    image(riverImage2, river2X, 0, canvasWidth, canvasHeight);
    image(riverImage2, river2X + canvasWidth, 0, canvasWidth, canvasHeight);
  
    if (!isPaused) {
      river2X -= river2Speed;
      if (river2X <= -canvasWidth) {
        river2X = 0;
      }
    }
  
    image(riverImage3, 0, 0, canvasWidth, canvasHeight);
    image(riverImage, 0, 0, canvasWidth, canvasHeight);
  
    // // **Draw Otter and Animate It**
    // if (!imagesLoaded || otterFrames.length === 0) {
    //   console.log("Otter images not loaded yet!");
    //   return;
    // }
  
    // frameCounter++;
    // if (frameCounter % frameDelay === 0) {
    //   currentFrame = (currentFrame + 1) % otterFrames.length;
    // }
  
// //Code to draw the otter.
//     //Draw the otter as a rectangle first 
//     fill(100, 100, 255);
//     rect(otterX, otterY, rectWidth, rectHeight);
  
    //Draw the image at the same rectangle location
    if (otterImage) {
      image(otterImage, otterX, otterY, otterWidth, otterHeight);
    }
  
    //Handle Otter Movement
    if (!isPaused) {
      if (keyIsDown(UP_ARROW) || keyIsDown(87)) otterY -= otterSpeed;
      if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) otterY += otterSpeed;
      if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) otterX -= otterSpeed;
      if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) otterX += otterSpeed;
    }
  
    //Keep the otter inside the river boundaries
    // otterY = constrain(otterY, riverTop, riverBottom - otterHeight);
    // otterX = constrain(otterX, riverLeft, riverRight - otterWidth);
    //Keep the otter inside the river boundaries, using the new hitbox that counters the image transparency height making the otter too tall.
    otterY = constrain(otterY, riverTop + hitboxHeight / 2, riverBottom - hitboxHeight / 2);
    otterX = constrain(otterX, riverLeft, riverRight - hitboxWidth);
    
    // Draw Bottom Banner
    fill(100, 40, 150);
    noStroke();
    rect(0, canvasHeight - bannerHeight, canvasWidth, bannerHeight);
  
    fill(255);
    textSize(20);
    textAlign(LEFT, CENTER);
    text(`Otters: ${lives}`, 20, canvasHeight - (bannerHeight / 2));
    textAlign(RIGHT, CENTER);
    text(`Score: ${score}`, canvasWidth - 20, canvasHeight - (bannerHeight / 2));
    textAlign(CENTER, CENTER);
    textSize(14);
    text("Press P to Pause", canvasWidth / 2, canvasHeight - (bannerHeight / 4));
  
    // Spawn and Update Obstacles
    if (frameCount % spawnRate === 0) {
      let obstacleHeight = 15;
      let obstacleWidth = 40;
      let obstacleY = random(riverTop, riverBottom - obstacleHeight);
      obstacles.push({
        x: canvasWidth,
        y: obstacleY,
        width: obstacleWidth,
        height: obstacleHeight
      });
      console.log("Spawning obstacle at:", canvasWidth, obstacleY);
    }
  
    for (let i = obstacles.length - 1; i >= 0; i--) {
      let obs = obstacles[i];
      if (!obs) {
        console.warn(`Skipping undefined obstacle at index ${i}`);
        continue; // Skip this iteration if obs is undefined
      }
      obs.x -= obstacleSpeed;
      fill(255, 50, 50);
      rect(obs.x, obs.y, obs.width, obs.height);
      
      if (
        otterX + (otterWidth - hitboxWidth) / 2 < obs.x + obs.width &&  // Adjust left boundary
        otterX + hitboxWidth + (otterWidth - hitboxWidth) / 2 > obs.x && // Adjust right boundary
        otterY + (otterHeight - hitboxHeight) / 2 < obs.y + obs.height && // Adjust top boundary
        otterY + hitboxHeight + (otterHeight - hitboxHeight) / 2 > obs.y // Adjust bottom boundary
      ) {
    //   if ( -- This was collision detection of the otter, but I am changing to a hitbox to circumvent the image being larger with a transparent background.
    //     otterX < obs.x + obs.width &&
    //     otterX + otterWidth > obs.x &&
    //     otterY < obs.y + obs.height &&
    //     otterY + otterHeight > obs.y
    //   ) {
        lives -= 1;
        hitMessage = random(messages);
        messageTimer = 120;
        obstacles.splice(i, 1);
        if (lives <= 0) {
          score = 0;
          lives = 3;
          obstacles = [];
        }
      } else if (obs.x + obs.width < 0) {
        score += 10;
        obstacles.splice(i, 1);
      }
    }
  
    //Display Hit Message if Active
    if (messageTimer > 0) {
      fill(0);
      textSize(30);
      textAlign(CENTER, CENTER);
      stroke(0);
      strokeWeight(2);
      fill(255);
      text(hitMessage, canvasWidth / 2, canvasHeight / 3);
      messageTimer--;
    }

    if (isPaused && gameOver) {
        background(30, 20, 60); // Dark background for Game Over screen
        fill(255);
        textSize(24);
        textAlign(CENTER, CENTER);
        text("Aw, little otter, you look pretty tired!", canvasWidth / 2, canvasHeight * 0.3);
        textSize(30);
        text("Let's take a break.", canvasWidth / 2, canvasHeight * 0.4);
        textSize(24);
        text(`Your score this round was: ${score}`, canvasWidth / 2, canvasHeight * 0.5);
        textSize(24);
        text("Press any key to try again.", canvasWidth / 2, canvasHeight * 0.6);
        return; // Stop game logic while Game Over screen is active
      }
}
  //Key Press handling - instead of ('p' === or 'P' ===) trying to change all instances of p to lowercase p
// Start the fade effect when a key is pressed
function keyTyped() {
    if (showInstructions && !startFade) {
      startFade = true; // Begin fading instructions
      return;
    }
  
    if (gameOver) {
        background(30, 20, 60); // Dark background for Game Over screen
        fill(255);
        textSize(30);
        textAlign(CENTER, CENTER);
        text("Aw, little otter, you look pretty tired!", canvasWidth / 2, canvasHeight * 0.3);
        
        textSize(24);
        text("Let's take a break.", canvasWidth / 2, canvasHeight * 0.4);
        
        textSize(20);
        text(`Your score this round was: ${score}`, canvasWidth / 2, canvasHeight * 0.5);
        
        textSize(18);
        text("Press any key to try again.", canvasWidth / 2, canvasHeight * 0.6);
        
        return; // Exit function early
    }
  
    if (key.toLowerCase() === 'p') {
      isPaused = !isPaused;
    }
  }
  
  // Start the fade effect when mouse is clicked
  function mousePressed() {
    if (showInstructions && !startFade) {
      startFade = true; // Begin fading
      } else if (gameOver && isPaused) {
      startFade = false;
      showInstructions = true;
  }
}
  function checkGameOver() {
    if (lives <= 0) {
      gameOver = true; // Set game over state
      isPaused = true; //Stop Game logic from running.
    }
  }

  