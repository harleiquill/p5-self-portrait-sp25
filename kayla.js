let song; // song variable
let satyr1, satyr2, satyr3, satyr4, satyr5; // The different frames of Satyr
// let sound, amp, delay, cnv; This one makes the whole canvas a button. Not using this.

let imgs = []; // array for sprite images
let forest; // background
let currImg = 0; // set current image frame to 0 for default
let button; // pause play for music
let spriteButton; // Button to animate/stop
let isLooping = false; // Animates Sprite, set to false for default
let isPlaying = false; // music state, set to off or false for default

// function mousePressed() { // Check if music is playing and start or stop based on current state
// if (song.isPlaying()) {
// song.pause(); // Pause if playing
// } else {
// song.play(); // Play if paused
// }

// //if (spriteButton.isLooping)
// } -- Moving to bottom of code


function preload() {
song = loadSound('Virgen.mp3'); // loading song
satyr1 = loadImage('satyr1.png'); // loading images for satyr
satyr2 = loadImage('satyr2.png');
satyr3 = loadImage('satyr3.png');
satyr4 = loadImage('satyr4.png');
satyr5 = loadImage('satyr5.png');
forest = loadImage ("forest.png");
// sound = loadSound('Virgen.mp3'); - This variable was changed to "song"
}

function setup() {
createCanvas(1024, 768);

// Load the sprite images into the array
imgs = [satyr1, satyr2, satyr3, satyr4, satyr5];
// Create the Music on/off button
button = createButton('Click to Play Music');// Sent link to p5.js website on buttonybuttons
button.position(20, 20);
button.mousePressed(playSound);
button.style('background color', '#a2d2ff');// Email link to stackoverflow explains tis
button.style('border-radius', '10px');// Email link to stack overflow ^^

spriteButton = createButton('Click to Dance');// Email I sent contains information on the buttons
spriteButton.position(20, 60);
spriteButton.mousePressed(toggleAnimation);
spriteButton.style('background-color', '#ffafcc');
spriteButton.style('border-radius', '10px');//Email I sent contains a link to stackoverflow that covers how to use .style

frameRate(18); //Determines the frame rate of the animation, I think this goes here.
//Don't need this
//textAlign(CENTER, CENTER);
// // Why isn't this working?
// textSize(60);
// fill(255);
// stroke(0);
// strokeWeight(4);
// text('For Kimberly', 50, 50);
// button = createButton('click to play music');
// button.position(0, 768);
// //Why isn't this working?
// spriteButton = createButton('click to dance');
// spriteButton.position(0, 500);
// // try to get the button to start and stop music
// button.mousePressed(playSound);
// imgs.push(satyr1, satyr2, satyr3, satyr4, satyr5);
// frameRate(18)


}

// function playSound() { (moved to the bottom of the code)
// if (sound.isPlaying()) {
// sound.stop();
// }
// else {
// sound.play();
// }


function draw() {
background(220);
image(forest, 0, 0);
// text("Click to Play/Pause", width / 2, height / 2);

//background(255);
// imgs.push(satyr1, satyr2, satyr3, satyr4, satyr5);
// frameRate(18);
image(imgs[currImg], 512, 600);
//satyr(img, 0, 0);
// image();
// if the current image is greater than 4, which is satyr5, then reset the current image to 0, which is the first image.
if (isLooping && frameCount % 6 === 0) {}
currImg++;// add 1 to image if it is less than 4
// if (currImg > 4) {
if (currImg >= imgs.length) {
currImg = 0;
}

// if (imgs.isPlaying()) {
// imgs.isPlaying();
// } else {
// imgs.pause();
// }
// button = createButton('click to play music'); // button to play or pause music
// button.position(1025, 0); --- Moved this to setup

//Why isn't this working?
// spriteButton = createButton('click to dance'); // button to start or stop the dancing
// spriteButton.position(1025, 750); --- Moved this to setup

// try to get the button to start and stop music
// button.mousePressed(playSound);

// imgs.push(satyr1, satyr2, satyr3, satyr4, satyr5);
// frameRate(18)

// Why isn't this working? (maybe because it was in setup? ;))
textSize(60);
fill(255);
stroke(0);
strokeWeight(4);
text('For Kimberly', 50, 50);

}

// function playSound() { //Rewriting below
// if (isPlaying()) {// removing sound.
// sound.stop();
// }
// else {
// sound.play();
// }
// }

// function toggleAnimation() {//Rewriting below
// isLooping = !isLooping
// spriteButton.html(isLooping ? 'Stop Dancing' : 'Start Dancing');
// }

// function mousePressed() { // Check if music is playing and start or stop based on current state
// if (song.isPlaying()) {
// song.pause(); // Pause if playing
// } else {
// song.play(); // Play if paused
// }

//if (spriteButton.isLooping)

function playSound() {
    if (song.isPlaying()) {
      song.pause();
      button.html('Click to Play Music');
    } else {
      song.loop(); // or song.play();
      button.html('Pause Music');
    }
  }

  function toggleAnimation() {
    isLooping = !isLooping;
    spriteButton.html(isLooping ? 'Stop Dancing' : 'Click to Dance');
  }


  // Kayla, 
  // I'm not sure if these things will work, because I am also a neophyte in the world of coding.
  // However, I am adding a list of solutions, I've also commented out and commented on several
  // things in your code. I would suggest changing your html file to display this file, and I will
  // happily show you how to do that, so you don't have to add all of this chaos into your 
  // .js file if it doesn't work. Then, you can cut and paste what works for you. I'm sending you
  // links also in the body of the email with the websites I found this information on, so you
  // can reference it in your README if you use any of these solutions. 
  // 
  // 1. I moved the button creation into the setup() function.
  // 2. Changed the mousePressed() function to fall under the buttons.
  //    This should make the mousePressed() ONLY trigger on the button, and not the whole canvas.
  // 3. song.isPlaying added because we didn't have a isPlaying() function but we were calling it,
  //    So, I'm not sure that button click function was ever going to work.
  // 4. I'm not sure if it was help from Travis or something you did, but there were some weird 
  //    calls in draw() for framerate() and push(), and since I didn't actually use those myself
  //    I wasn't sure what you were trying to do here. My way, obviously, likely not the most
  //    efficient way to do it - but it worked for me. I'm hoping we can put this in your repo
  //    area and see if it works!
  // I would suggest you not throw this into your file, especially since we got everything showing
  // up finally; I'm especially glad that putting the text at the end of draw() was able to help 
  // based on the way draw() layers items! If nothing else, we fixed that! :)
  // -j
