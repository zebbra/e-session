import * as faceapi from "face-api.js";
import consola from "consola";

const faceApi = faceapi;
const inputSize = 224;
const scoreThreshold = 0.5;
faceApi.env.setEnv(faceApi.env.createNodejsEnv());
faceApi.env.monkeyPatch({
  Canvas: OffscreenCanvas,
  createCanvasElement: () => {
    return new OffscreenCanvas(480, 270);
  },
});

_loadModels();

async function _loadModels() {
  try {
    await faceApi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceApi.nets.faceExpressionNet.loadFromUri("/models");
  } catch (e) {
    consola.error(e);
  }
}

function _getFaceDetectorOptions() {
  return new faceApi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
}

export async function getPrediction(imgData) {
  if (!faceApi) {
    return null;
  }
  try {
    const img = faceapi.createCanvasFromMedia(imgData);
    return await faceApi
      .detectSingleFace(img, _getFaceDetectorOptions())
      .withFaceExpressions();
  } catch (e) {
    consola.error(e);
  }
}
