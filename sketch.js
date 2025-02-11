let canvasWidth, canvasHeight;
let riverImage, riverImage2, riverImage3, riverImage4, riverImage5, riverImage6;  
let river2X = 0; // X position for River_layer2 moving left
let river2Speed = 0.5; // Speed for River_layer2
let otter; // Variable for the otter Sprite

function preload() {
  riverImage = loadImage("Assets/River_layer1.png");  
  riverImage2 = loadImage("Assets/River_layer2.png");  
  riverImage3 = loadImage("Assets/River_layer3.png");
  riverImage4 = loadImage("Assets/River_layer4.png");
  riverImage5 = loadImage("Assets/River_layer5.png");
  riverImage6 = loadImage("Assets/River_layer6.png");
  otterImage = loadImage("Assets/liltter_swim_8fps.gif");
}

function setup() {
  canvasWidth = windowWidth * 0.8;  
  canvasHeight = windowHeight * 0.8;  
  new Canvas(canvasWidth, canvasHeight);
  otter = new Sprite(100, canvasHeight - 100, 50, 30); //Create an otter sprite at (x, y) with a width and height
  otter.img = otterImage; //Assign Image to the Sprite.
}

function draw() {
  background(220);  

  // Draw static layers
  image(riverImage6, 0, 0, canvasWidth, canvasHeight);  
  image(riverImage5, 0, 0, canvasWidth, canvasHeight);
  image(riverImage4, 0, 0, canvasWidth, canvasHeight);

  // Moving River_layer2 (leftward)
  image(riverImage2, river2X, 0, canvasWidth, canvasHeight);
  image(riverImage2, river2X + canvasWidth, 0, canvasWidth, canvasHeight);

  // Move River_layer2 to the left
  river2X -= river2Speed;
  if (river2X <= -canvasWidth) {
    river2X = 0;
  }

  // Static River_layer3 (on top of River_layer2)
  image(riverImage3, 0, 0, canvasWidth, canvasHeight);

  // Draw the foreground layer last
  image(riverImage, 0, 0, canvasWidth, canvasHeight);
  drawSprite();

}

function update() {
  clear();
}

function windowResized() {
  canvasWidth = windowWidth * 0.8;
  canvasHeight = windowHeight * 0.8;
  resizeCanvas(canvasWidth, canvasHeight);
}


