let capture;
let loadedCamera;
let yOff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam();
  startPoseNet(capture);
}

function draw() {
  let p = person;
  noStroke();
  yOff = (height - capture.height) / 2;
  background(255);
  // display video
  image(capture, 0, yOff);

  fill("red");
  noStroke();
  keypoints.forEach((keypoint) => {
    circle(keypoint.position.x, keypoint.position.y + yOff, 10);
  });

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
      setCameraDimensions();
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setCameraDimensions();
}
