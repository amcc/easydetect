import {
  HandLandmarker,
  FilesetResolver,
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";

let handLandmarker;
let runningMode = "VIDEO";
// let video = null;
let lastVideoTime = -1;
let captureEvent;
let loadedCamera;
window.handedness = []
window.landmarks = []
window.worldLandmarks = []

// Before we can use PoseLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createPoseLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "GPU"
    },
    runningMode: runningMode,
    numHands: 2
  });
};
createPoseLandmarker();

window.predictWebcam = async (video) => {
  
  // Now let's start detecting the stream.
  let startTimeMs = performance.now();

  if (lastVideoTime !== video.elt.currentTime) {
    lastVideoTime = video.elt.currentTime;
    let results = handLandmarker.detectForVideo(video.elt, startTimeMs);
    handedness = results.handedness
    landmarks = results.landmarks
    worldLandmarks = results.worldLandmarks
  }

  // Call this function again to keep predicting when the browser is ready.
  window.requestAnimationFrame(() => {
    predictWebcam(video)
  });
};
