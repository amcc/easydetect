// how to use
// once you have included "easyPoseNet.js" as an import in your HTML you can access pose positions for body parts of a single human.

// start PoseNet with the function "startPoseNet()" in your p5 setup function

// Parameters / Arguments
// If you provide no arguments a video element will be created called "poseNetVideo" which you can access to display the video if you choose.
// Video: make a video element startPoseNet(video)
// Image: make a p5 image startPoseNet(image)

// available variables:
// "person": access individual body part positions with the 'person' object.
// for instance: person.nose.x, person.nose.y

// "keypoints" you can use the keypoints array to show all body parts by looping over it.

// "poseNetVideo" available if no argument provided to startPoseNet()

// ---------------------------- //

// if you want to use an image uncomment the lines below and use instead of the video, also check setup and draw

// let video;
let img;

function preload() {
  img = loadImage("jump.jpg");
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // choose a video or image
  startPoseNet(video);
  // startPoseNet(img);
}

function draw() {
  // define a list of variables you can use for x/y coordinates
  // confused about this syntax ? check out the "destructuring assignment" in the JavaScript documentation
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment

  let {
    nose,
    leftEye,
    rightEye,
    leftEar,
    rightEar,
    leftShoulder,
    rightShoulder,
    leftElbow,
    rightElbow,
    leftWrist,
    rightWrist,
    leftHip,
    rightHip,
    leftKnee,
    rightKnee,
    leftAnkle,
    rightAnkle,
  } = person;

  background(220);

  // display a video or image
  image(video, 0, 0);
  // image(img, 0, 0);

  noStroke();
  fill("red");
  fill(255, 255, 0);

  // an example of how to use one of the above body parts
  circle(nose.x, nose.y, 50);

  // all the keypoints for the body
  fill(255, 0, 0);
  keypoints.forEach((keypoint) => {
    circle(keypoint.position.x, keypoint.position.y, 10);
  });

  // if you want to draw multiple people you can use the 'poses' array
}
