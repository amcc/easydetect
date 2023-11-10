// HOW TO USE
// predictWebcam(video) will start predicting landmarks

// pass a video MediaElement using createCapture
// make sure to call predictWebcam as a callback to createCapture
// this ensures the video is ready

// parts index and documentation:
// https://developers.google.com/mediapipe/solutions/vision/hand_landmarker

let capture;
let captureEvent;

function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam();
}

function draw() {
  background(255);
  image(capture, 0, 0);

  // landmarks contain an array of hands
  if (landmarks.length > 0) {
    landmarks.forEach((hand, index) => {
      // each hand contains an array of finger/knuckle positions

      // handedness stores if the hands are right/left
      let handedness = handednesses[index][0].displayName;

      // if using a front camera hands are the wrong way round so we flip them
      handedness === "Right" ? (handedness = "Left") : (handedness = "Right");

      // lets colour each hand depeding on whether its the first or second hand
      handedness === "Right" ? fill(255, 0, 0) : fill(0, 255, 0);

      hand.forEach((part, index) => {
        // each part is a knuckle or section of the hand
        // we have x, y and z positions so we could also do this in 3D (WEBGL)
        if (index === 8) {
          textSize(30);
          text(
            handedness,
            part.x * capture.width + 20,
            part.y * capture.height
          );
        }
        circle(part.x * capture.width, part.y * capture.height, part.z * 100);
      });
    });
  }
}

// this function helps to captuer the webcam in a way that ensure video is loaded
// before we start predicting landmarks. Creatcapture has a callback which is
// only called when the video is correctly loaded. At that point we set the dimensions
// and start predicting landmarks
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
      // capture.srcObject = e;

      setCameraDimensions();
      predictWebcam(capture);
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
