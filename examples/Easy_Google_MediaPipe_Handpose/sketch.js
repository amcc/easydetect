// HOW TO USE
// predictWebcam(video) will start predicting landmarks

// pass a video MediaElement using createCapture
// make sure to call predictWebcam as a callback to createCapture
// this ensures the video is ready

// parts index:
// https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/index

let capture;
let loadedCamera;
let captureEvent;

function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam();
}

function draw() {
  background(255);
  image(capture, 0, 0);

  // console.log({landmarks})
  let first = true;
  if (landmarks.length > 0) {
    for (const hand of landmarks) {
      first ? fill(255, 0, 0) : fill(0, 255, 0);
      first = false;
      for (const m of hand) {
        circle(m.x * capture.width, m.y * capture.height, m.z * 100);
      }
    }
  }
}

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
      capture.srcObject = e;

      setCameraDimensions();
      predictWebcam(capture);
    }
  );
  capture.elt.setAttribute("playsinline", "");
  capture.hide();
}

function setCameraDimensions() {
  loadedCamera = captureEvent.getTracks()[0].getSettings();
  // console.log("cameraDimensions", loadedCamera);
  if (capture.width > capture.height) {
    capture.size(width, (capture.height / capture.width) * width);
  } else {
    capture.size((capture.width / capture.height) * height, height);
  }
  // console.log(capture);
}

function getAngle(v0x, v0y, v1x, v1y) {
  return atan2(v1y - v0y, v1x - v0x);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setCameraDimensions();
}
