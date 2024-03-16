function getRotation(capture, mediaPipe) {
  if (mediaPipe.faceLandmarks.length <= 0) return;

  let face2D = [];
  var points = [1, 33, 263, 61, 291, 199];
  var pointsObj = [
    0,
    -1.126865,
    7.475604, // nose 1
    -4.445859,
    2.663991,
    3.173422, //left eye corner 33
    4.445859,
    2.663991,
    3.173422, //right eye corner 263
    -2.456206,
    -4.342621,
    4.283884, // left mouth corner 61
    2.456206,
    -4.342621,
    4.283884, // right mouth corner 291
    0,
    -9.403378,
    4.264492,
  ]; //chin

  var width = capture.width; //canvasElement.width; //
  var height = capture.height; //canvasElement.height; //results.image.height;
  var roll = 0,
    pitch = 0,
    yaw = 0;
  var x, y, z;

  // Camera internals
  var normalizedFocaleY = 1.28; // Logitech 922
  var focalLength = height * normalizedFocaleY;
  var s = 0; //0.953571;
  var cx = width / 2;
  var cy = height / 2;

  var cam_matrix = cv.matFromArray(3, 3, cv.CV_64FC1, [
    focalLength,
    s,
    cx,
    0,
    focalLength,
    cy,
    0,
    0,
    1,
  ]);

  //The distortion parameters
  //var dist_matrix = cv.Mat.zeros(4, 1, cv.CV_64FC1); // Assuming no lens distortion
  var k1 = 0.1318020374;
  var k2 = -0.1550007612;
  var p1 = -0.0071350401;
  var p2 = -0.0096747708;
  var dist_matrix = cv.matFromArray(4, 1, cv.CV_64FC1, [k1, k2, p1, p2]);

  for (const point of points) {
    var point0 = landmarks[point];

    //console.log("landmarks : " + landmarks.landmark.data64F);

    drawingUtils.drawLandmarks(canvasCtx, [point0], { color: "#FFFFFF" }); // expects normalized landmark

    var x = point0.x * width;
    var y = point0.y * height;
    //var z = point0.z;

    // Get the 2D Coordinates
    face_2d.push(x);
    face_2d.push(y);
  }
}
