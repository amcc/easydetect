// HOW TO USE
// predictWebcam(video) will start predicting landmarks
// pass a video MediaElement using createCapture
// make sure to call predictWebcam as a callback to createCapture
// this ensures the video is ready

// parts index and documentation:
// https://developers.google.com/mediapipe/solutions/vision/hand_landmarker

let capture;
let captureEvent;

let predictionsElement;

function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam();
  predictionsElement = document.getElementById("predictions");
}

function draw() {
  background(255);
  // drawBlendShapes(predictionsElement, mediaPipe.faceBlendshapes);

  // flip the webcam image so it looks like a mirror
  push();
  scale(-1, 1); // mirror webcam
  image(capture, -capture.width, 0); // draw webcam
  scale(-1, 1); // unset mirror
  pop();

  // put a yellow circle on each landmark
  if (mediaPipe.faceLandmarks.length > 0) {
    // we have a face
    mediaPipe.faceLandmarks.forEach((face, index) => {
      face.forEach((landmark, index) => {
        noStroke();
        fill("yellow");
        circle(...getFlipPos(landmark), 5);
      });
    });
  }

  // helper functions to draw parts of the face
  noStroke();
  fill(0);
  circlePart(mediaPipe.parts.leftIris);
  circlePart(mediaPipe.parts.rightIris);
  strokeWeight(1);
  stroke("white");
  outLinePart(mediaPipe.parts.tesselation);
  strokeWeight(3);
  stroke("red");
  outLinePart(mediaPipe.parts.leftEye);
  stroke("green");
  outLinePart(mediaPipe.parts.rightEye);
  stroke("tomato");
  outLinePart(mediaPipe.parts.faceOval);
  stroke("hotpink");
  outLinePart(mediaPipe.parts.lips);
}

// return flipped x and y positions
function getFlipPos(part, xAdd = 0, yAdd = 0) {
  return [
    capture.width - part.x * capture.width + xAdd,
    part.y * capture.height + yAdd,
  ];
}

// draw lines between each 'bit' of a 'part
function outLinePart(part) {
  if (part && part.length > 0 && mediaPipe.faceLandmarks.length > 0) {
    // let start = mediaPipe.parts.leftEye[0].start;
    // console.log(mediaPipe.faceLandmarks[0][start]);
    part.forEach((bit) => {
      line(
        ...getFlipPos(mediaPipe.faceLandmarks[0][bit.start]),
        ...getFlipPos(mediaPipe.faceLandmarks[0][bit.end])
      );
    });
  }
}

// draw a filled shape between each 'bit' of a 'part
function fillPart(part) {
  if (part && part.length > 0 && mediaPipe.faceLandmarks.length > 0) {
    // let start = mediaPipe.parts.leftEye[0].start;
    // console.log(mediaPipe.faceLandmarks[0][start]);
    beginShape();

    part.forEach((bit, index) => {
      // if (index === 0)
      //   vertex(...getFlipPos(mediaPipe.faceLandmarks[0][bit.start]));
      vertex(...getFlipPos(mediaPipe.faceLandmarks[0][bit.end]));
    });
    endShape(CLOSE);
  }
}

// useful for the iris
// estimate the centre and width of a circle then draw
function circlePart(part) {
  if (part && part.length > 0 && mediaPipe.faceLandmarks.length > 0) {
    // get minimum and maximum x and y values
    const xArray = part.map((bit) => mediaPipe.faceLandmarks[0][bit.end].x);
    const yArray = part.map((bit) => mediaPipe.faceLandmarks[0][bit.end].y);
    const diameter = Math.max(...xArray) - Math.min(...xArray);
    const x = xArray.reduce((total, item) => total + item) / part.length;
    const y = yArray.reduce((total, item) => total + item) / part.length;
    circle(...getFlipPos({ x, y }), diameter * capture.width);
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
      console.log(captureEvent.getTracks()[0].getSettings());
      // do things when video ready
      // until then, the video element will have no dimensions, or default 640x480
      capture.srcObject = e;

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

function drawBlendShapes(el, blendShapes) {
  if (!blendShapes.length) {
    return;
  }

  let htmlMaker = "";
  blendShapes[0].categories.map((shape) => {
    htmlMaker += `
      <li class="blend-shapes-item">
        <span class="blend-shapes-label">${
          shape.displayName || shape.categoryName
        }</span>
        <span class="blend-shapes-value" style="width: calc(${
          +shape.score * 100
        }% - 120px)">${(+shape.score).toFixed(4)}</span>
      </li>
    `;
  });

  el.innerHTML = htmlMaker;
}
