import * as faceapi from "face-api.js";

const inputSize = 224;
const scoreThreshold = 0.5;

function _getFaceDetectorOptions() {
  return new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
}

export async function initFaceApi() {
  faceapi.env.setEnv(faceapi.env.createNodejsEnv());
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceExpressionNet.loadFromUri("/models");
}

export async function detect(data) {
  faceapi.env.monkeyPatch({
    Canvas: OffscreenCanvas,
    createCanvasElement: () => {
      return new OffscreenCanvas(data.w, data.h);
    },
  });
  const canvas = new OffscreenCanvas(data.w, data.h);
  canvas.getContext("2d").putImageData(data.imgData, 0, 0);
  console.log("backend: ", faceapi.tf.getBackend());
  return await faceapi
    .detectSingleFace(canvas, _getFaceDetectorOptions())
    .withFaceExpressions();
}
