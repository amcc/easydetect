import {
  FaceLandmarker,
  FilesetResolver,
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";

// make an object to export
// at the end of the file this has the predictWebCam function added
// it is then exported for use in the sketch.js file
const mediaPipe = {
  faceLandmarks: [],
  faceBlendshapes: [],
  parts: [],
};

let faceLandmarker;
let runningMode = "IMAGE";
// let video = null;
let lastVideoTime = -1;

// Before we can use PoseLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createFaceLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU",
    },
    outputFaceBlendshapes: true,
    runningMode,
    numFaces: 1,
  });
};
createFaceLandmarker();

const predictWebcam = async (video) => {
  // Now let's start detecting the stream.
  let startTimeMs = performance.now();

  if (lastVideoTime !== video.elt.currentTime && faceLandmarker) {
    lastVideoTime = video.elt.currentTime;
    let results = faceLandmarker.detect(video.elt, startTimeMs);
    mediaPipe.faceLandmarks = results.faceLandmarks;
    mediaPipe.faceBlendshapes = results.faceBlendshapes;
    mediaPipe.parts = {
      tesselation: FaceLandmarker.FACE_LANDMARKS_TESSELATION,
      rightEye: FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
      leftEye: FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
      rightEyebrow: FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
      leftEyebrow: FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
      faceOval: FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
      lips: FaceLandmarker.FACE_LANDMARKS_LIPS,
      rightIris: FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
      leftIris: FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
    };
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
