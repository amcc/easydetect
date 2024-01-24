// HOW TO USE
// predictWebcam(video) will start predicting mediaPipe.landmarks

// pass a video MediaElement using createCapture
// make sure to call predictWebcam as a callback to createCapture
// this ensures the video is ready

// parts index:
// https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/index

let capture;
let confidence = 0.0;
let yOff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam();
}

function draw() {
  background(255);

  // flip the webcam image so it looks like a mirror
  push();
  scale(-1, 1); // mirror webcam
  image(capture, -capture.width, 0); // draw webcam
  scale(-1, 1); // unset mirror
  pop();

  // mediaPipe.landmarks contains an array of people
  if (mediaPipe.landmarks.length > 0) {
    mediaPipe.landmarks.forEach((person, index) => {
      // each person contains an array of positions of each body part
      person.forEach((part) => {
        // draw a circle on each body part
        // multiply by capture width and height to get the correct position
        circle(getFlipPos(part)[0], getFlipPos(part)[1], 10);
      });
    });
  }
}

// return flipped x and y positions
function getFlipPos(part, xAdd = 0, yAdd = 0) {
  return [
    capture.width - part.x * capture.width + xAdd,
    part.y * capture.height + yAdd,
  ];
}

// this function helps to captuer the webcam in a way that ensure video is loaded
// before we start predicting mediaPipe.landmarks. Creatcapture has a callback which is
// only called when the video is correctly loaded. At that point we set the dimensions
// and start predicting mediaPipe.landmarks
function captureWebcam() {
  capture = createCapture(
    {
      audio: false,
      video: {
        facingMode: "user",
      },
    },
    function (e) {
      captureEvent = e;
      // do things when video ready
      // until then, the video element will have no dimensions, or default 640x480
      setCameraDimensions();
      mediaPipe.predictWebcam(capture);
    }
  );
  capture.elt.setAttribute("playsinline", "");
  capture.hide();
}

// this function sets the dimensions of the video element to match the
// dimensions of the camera. This is important because the camera may have
// different dimensions than the default video element
function setCameraDimensions() {
  // resize the capture depending on whether
  // the camera is landscape or portrait

  if (capture.width > capture.height) {
    capture.size(width, (capture.height / capture.width) * width);
  } else {
    capture.size((capture.width / capture.height) * height, height);
  }
}

// resize the canvas when the window is resized
// also reset the camera dimensions
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setCameraDimensions();
}
