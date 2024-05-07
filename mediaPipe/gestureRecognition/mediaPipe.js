import {
  GestureRecognizer,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

// make an object to export
// at the end of the file this has the predictWebCam function added
// it is then exported for use in the sketch.js file
const mediaPipe = {
  handednesses: [],
  landmarks: [],
  worldLandmarks: [],
  gestures: [],
};

let gestureRecognizer;
let runningMode = "VIDEO";
// let video = null;
let lastVideoTime = -1;

// Before we can use PoseLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createPoseLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task`,
      delegate: "GPU",
    },
    runningMode: runningMode,
    numHands: 2,
  });
};
createPoseLandmarker();

const predictWebcam = async (video) => {
  // Now let's start detecting the stream.
  let startTimeMs = performance.now();

  if (lastVideoTime !== video.elt.currentTime && gestureRecognizer) {
    lastVideoTime = video.elt.currentTime;
    let results = gestureRecognizer.recognizeForVideo(video.elt, startTimeMs);
    mediaPipe.handednesses = results.handednesses;
    mediaPipe.landmarks = results.landmarks;
    mediaPipe.worldLandmarks = results.worldLandmarks;
    mediaPipe.gestures = results.gestures;
  }

  // Call this function again to keep predicting when the browser is ready.
  window.requestAnimationFrame(() => {
    predictWebcam(video);
  });
};

// add the predictWebcam function to the mediaPipe object
mediaPipe.predictWebcam = predictWebcam;

// export for use in sketch.js via an inline import script
// see the html file for more
export { mediaPipe };
