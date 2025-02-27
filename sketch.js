let canvasWidth, canvasHeight;//Vars to allow for resizable window
let riverImage, riverImage2, riverImage3, riverImage4, riverImage5, riverImage6;  //Vars for background images
let river2X = 0; //Var to preload the animated river picture.
let river2Speed = 0.5; //Defines animation speed of river picture.
let otterX, otterY; //Otter sprite X Y coordinates
let otterWidth = 50, otterHeight = 30; //Definition of otter size as a rectangle, may be commented out later.
let frameColor = [50, 0, 100];  //Definition of otter rect color.
let strokeColor = [192, 192, 192];  //Definition of otter rect stroke.
let bannerHeight = 60; //Size of lower banner displaying the score, pause info, and lives left.
let otterSpeed = 5; //Speed the otter sprite moves at to control game balance.
let hitMessage = ""; // Stores the current hit message
let messageTimer = 0; // Timer for displaying messages
let otterFrames = [];//Array to preload images into.
let currentFrame = 0;//Starting frame for animation
let frameDelay = 5; // Controls animation speed
let frameCounter = 0;//Starting frame counter

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
let score = 0;//Starting score
let lives = 3;//Starting lives
let obstacles = [];//Array for obstacles
let obstacleSpeed = 3.5;//Speed of obstacles to maintain game balance vs otter movement of 5
let spawnRate = 90;//How often the obstacles spawn.

// Game states
let isPaused = false;//Game status for paused.
let showInstructions = true; // Show instructions at start, using a game status for instructions

// Define movement boundaries for otter sprite
let riverTop, riverBottom, riverLeft, riverRight;

function preload() {
  //Load each image for the river background.
  riverImage = loadImage("Assets/River_layer1.png");  
  riverImage2 = loadImage("Assets/River_layer2.png");  
  riverImage3 = loadImage("Assets/River_layer3.png");
  riverImage4 = loadImage("Assets/River_layer4.png");
  riverImage5 = loadImage("Assets/River_layer5.png");
  riverImage6 = loadImage("Assets/River_layer6.png");
  //Load each otter swim frame into the array
  otterFrames.push(loadImage("Assets/otter_swim1.png"));
  otterFrames.push(loadImage("Assets/otter_swim2.png"));
  otterFrames.push(loadImage("Assets/otter_swim3.png"));
  otterFrames.push(loadImage("Assets/otter_swim4.png"));
  
}

function setup() {
  //Defines canvas for resizing using 80% of window width and height.
  canvasWidth = windowWidth * 0.8;  
  canvasHeight = windowHeight * 0.8;  
  createCanvas(canvasWidth, canvasHeight); //Create canvas using variables that resize
//Define the height of the river base and range for the sprite bounding box.
  let riverBase = canvasHeight * 0.7; 
  let riverRange = canvasHeight * 0.15; 
//Defines the "top" of the bounding box by subtracting the range from the base.
  riverTop = riverBase - riverRange;  
  riverBottom = riverBase;  //Defines the river base as the river bottom, the river base is the resizable variable based on window size.
//Define the left and right barriers for the otter's bounding box - the right is 1/2 the window width, the left prevents running off the screen.
  riverLeft = 20; 
  riverRight = canvasWidth / 2; 
//Defines start position of the otter within the bounding box.
  otterX = riverLeft + 50;
  otterY = riverBottom - (riverRange / 2); 
}

function draw() {
  background(220);

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

  //Load river background images in specific layer order.
  image(riverImage6, 0, 0, canvasWidth, canvasHeight);  
  image(riverImage5, 0, 0, canvasWidth, canvasHeight);
  image(riverImage4, 0, 0, canvasWidth, canvasHeight);

  // Moving River layer placed here so it loads in the proper layer order.
  image(riverImage2, river2X, 0, canvasWidth, canvasHeight);
  image(riverImage2, river2X + canvasWidth, 0, canvasWidth, canvasHeight);
  river2X -= river2Speed;
  if (river2X <= -canvasWidth) {//Restarts the river animation loop when the first iteration reaches the left side.
    river2X = 0;
  }
//Finish loading background images in proper order.
  image(riverImage3, 0, 0, canvasWidth, canvasHeight);
  image(riverImage, 0, 0, canvasWidth, canvasHeight);
// This will be the framecounter for the otter sprite
frameCounter++;
if (frameCounter % frameDelay === 0) {
  currentFrame = (currentFrame + 1) % otterFrames.length; // Cycle through images
}
//Draw the animated otter sprite
image(otterFrames[currentFrame], otterX, otterY, otterWidth, otterHeight);


  //Define the otter movement using arrow keys and WASD.
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
//This ensures the otter remains within the bounding box.
  otterY = constrain(otterY, riverTop, riverBottom - otterHeight);
  otterX = constrain(otterX, riverLeft, riverRight - otterWidth);

  // //Draw Otter as a rectangle, commented out to test the animation listed above.
  // fill(100, 100, 255); 
  // rect(otterX, otterY, otterWidth, otterHeight);

  //Handle Obstacles
  if (frameCount % spawnRate === 0) {
    spawnObstacle();
  }
  updateObstacles();

  //Draw Bottom Banner
  fill(100, 0, 50);  
  noStroke();
  rect(0, canvasHeight - bannerHeight, canvasWidth, bannerHeight); 

  //Display Score, Lives & Pause Message
  fill(255);  
  textSize(20);
  textAlign(LEFT, CENTER);
  text(`Otters: ${lives}`, 20, canvasHeight - (bannerHeight / 2)); //Maintains proper life count.

  textAlign(RIGHT, CENTER);
  text(`Score: ${score}`, canvasWidth - 20, canvasHeight - (bannerHeight / 2)); //Calculates current score +10 per obstacle avoided defined below.

  textAlign(CENTER, CENTER);
  textSize(14);
  text("Press P to Pause", canvasWidth / 2, canvasHeight - (bannerHeight / 4));//Simple Pause instructions.
  
  //Display Hit Message (If Active)
  if (messageTimer > 0) {
    displayHitMessage();//Displays a message from the hit message display array randomly.
    messageTimer--; // Countdown timer
  }
}
// Definition of Instruction Screen
function displayInstructionScreen() {
  background(50, 0, 100); // Dark purple background

  fill(255);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("Welcome to Current Course!", canvasWidth / 2, canvasHeight * 0.3);//Displays the game's name.
  textSize(20);
  text("An Otter-based game where you dodge obstacles in the river to get home safe!", //Displays brief game description.
       canvasWidth / 2, canvasHeight * 0.4);
  textSize(18);
  text("Press any key or click to start!", canvasWidth / 2, canvasHeight * 0.6);//Instructions for how to get the game started.
}

// Definition of the Pause Screen
function displayPauseScreen() {
  fill(0, 0, 0, 150); // Semi-transparent overlay
  rect(canvasWidth / 4, canvasHeight / 3, canvasWidth / 2, canvasHeight / 4, 20); // Rounded rectangle

  fill(255, 255, 0);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("PAUSED - Press 'P' to Resume", canvasWidth / 2, canvasHeight / 2);//Instructions to return to the game.
}

//Definition of the Obstacle Spawning Behavior
function spawnObstacle() {
  let obstacleHeight = 15; //Obstacle size
  let obstacleWidth = 40;//Obstacle size
  let obstacleY = random(riverTop, riverBottom - obstacleHeight);//Sets the height of the obstacle spawn relative to the top and bottom of the animated river layer

  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvasWidth - 150) {
    obstacles.push({ x: canvasWidth, y: obstacleY, width: obstacleWidth, height: obstacleHeight });
  }
}

//Update Obstacle location so they are animated to move across the screen.
function updateObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.x -= obstacleSpeed;//Uses speed var to define how fast the obstacle moves.

    //Draw obstacle as rect - to be replaced with an array of images.
    fill(255, 50, 50);
    rect(obs.x, obs.y, obs.width, obs.height);

    //Collision Detection - defines what constitutes a collision based on the height, width, and x/y position of both the otter and the obstacle.
    if (collides(otterX, otterY, otterWidth, otterHeight, obs.x, obs.y, obs.width, obs.height)) {
      lives -= 1;//Removes 1 life if the otter collides.
      hitMessage = random(messages); // Pick a random message and display to player.
      messageTimer = 120; // Display message for 2 seconds (120 frames at 60 FPS)
      obstacles.splice(i, 1);
      checkGameOver();//Runs the function to check if the amount of lives has reached 0.
    } else if (obs.x + obs.width < 0) {
      score += 10;//Adds 10 to score when an obstacle is missed.
      obstacles.splice(i, 1);
    }
  }
}

//Collision Detection global level
function collides(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (
    x1 < x2 + w2 &&
    x1 + w1 > x2 &&
    y1 < y2 + h2 &&
    y1 + h1 > y2
  );
}

//Game Over Check - function checks if the lives have reached 0.
function checkGameOver() {
  if (lives <= 0) {
    score = 0;
    lives = 3;
    obstacles = [];
  }
}
//Key Press handling - instead of ('p' === or 'P' ===) trying to change all instances of p to lowercase p
//Using all the different pP variations wasn't working, to bypass that this will make all p into lowercase, and only one key is needed to define the pause screen command.
function keyTyped() {
  if (showInstructions) {
    showInstructions = false; 
    return; 
  }

  if (key.toLowerCase() === 'p') { // Ensures "P" or "p" works by making all p keypresses lowercase, bypassing someone accidentally turning on capslock.
    isPaused = !isPaused;
  }
}
//This function allows a mouse click to end the instruction screen and start the game.
function mousePressed() {
  if (showInstructions) {
    showInstructions = false;
  }
}
//Function to Display the "Oh No!" Message when the otter sprite hits an obstacle.
function displayHitMessage() {
  fill(0); 
  textSize(30);
  textAlign(CENTER, CENTER);
  stroke(0); // Black stroke
  strokeWeight(2);
  fill(255); // White text
  text(hitMessage, canvasWidth / 2, canvasHeight / 3);
}