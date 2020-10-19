/* eslint-disable no-undef */
importScripts("/faceEnvWorkerPatch.js");
importScripts("/face-api.min.js");

const inputSize = 224;
const scoreThreshold = 0.5;

function _getFaceDetectorOptions() {
  return new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
}

async function _loadModels() {
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    // console.log("loaded mobilenet face detection");
  } catch (e) {
    console.log(e);
  }
}

async function _detect(img) {
  try {
    return await faceapi
      .detectSingleFace(img, _getFaceDetectorOptions())
      .withFaceExpressions();
  } catch (e) {
    console.log(e);
  }
}

self.addEventListener(
  "message",
  async function (event) {
    const data = event.data;
    switch (data.cmd) {
      case "init":
        // faceapi.env.setEnv(faceapi.env.createNodejsEnv());
        _loadModels();
        self.postMessage("Initalizing models...");
        break;
      case "detect": {
        console.log("detect data: ", data);
        const imgData = new ImageData(
          new Uint8ClampedArray(data.data),
          data.width,
          data.height,
        );
        const img = faceapi.createCanvasFromMedia(imgData);
        const result = await _detect(img);
        self.postMessage({ cmd: "detected", result });
        break;
      }
      default:
        // console.log("defaultdefaultdefault");
        self.postMessage("Unknown command: " + data.cmd);
        break;
    }
  },
  false,
);
