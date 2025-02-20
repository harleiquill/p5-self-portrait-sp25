let nameInput, zipInput, submitButton, saveButton;
let displayText = "Enter details above";

function setup() {
  createCanvas(400, 300);
  textAlign(CENTER, CENTER);
  textSize(16);

  // Center elements
  let centerX = windowWidth / 2;

  // Name input field
  nameInput = createInput('');
  nameInput.position(centerX - 75, 20);
  nameInput.size(150);
  nameInput.attribute("placeholder", "Enter Name");

  // ZIP code input field
  zipInput = createInput('');
  zipInput.position(centerX - 75, 50);
  zipInput.size(150);
  zipInput.attribute("placeholder", "Enter ZIP Code");

  // Submit button
  submitButton = createButton('Submit');
  submitButton.position(centerX - 40, 80);
  submitButton.mousePressed(updateCanvas);

  // Save button
  saveButton = createButton('Download Info');
  saveButton.position(centerX + 20, 80);
  saveButton.mousePressed(downloadText);
}

function draw() {
  background(220);
  fill(0);
  text(displayText, width / 2, height / 2);
}

function updateCanvas() {
  let name = nameInput.value().trim();
  let zip = zipInput.value().trim();
  
  if (name === "" || zip === "") {
    displayText = "Please fill out both fields";
  } else {
    displayText = `Name: ${name}\nZIP: ${zip}`;
  }
}

function downloadText() {
  let name = nameInput.value().trim();
  let zip = zipInput.value().trim();
  
  if (name === "" || zip === "") {
    alert("Fill out both fields before downloading.");
    return;
  }

  let content = `Name: ${name}\nZIP: ${zip}`;
  save(content, 'user_info.txt');
}

// Adjust positioning when window resizes
function windowResized() {
  let centerX = windowWidth / 2;
  nameInput.position(centerX - 75, 20);
  zipInput.position(centerX - 75, 50);
  submitButton.position(centerX - 40, 80);
  saveButton.position(centerX + 20, 80);
}
