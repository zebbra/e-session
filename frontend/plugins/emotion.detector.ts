// import { ref } from "@vue/composition-api";
// import consola from "consola";
// import Vue from "vue";
import * as faceapi from "face-api.js";
import { conferenceStore, detectionStore } from "~/store";
// import { options, initOptions, confOptions } from "~/utils/jitsi";
// import { handleGum } from "~/utils/gumErrorHandling";
// import { useEndShare } from "~/composable/useRoom";

export default ({ app }) => {
  let warmUp: boolean = true;
  let doDetection: boolean = false;
  const inputSize = 224;
  const scoreThreshold = 0.5;

  app.$faceApi = faceapi;

  app.$initFaceApi = async () => {
    await app.$faceApi.nets.tinyFaceDetector.loadFromUri("/models");
    // await app.$faceApi.nets.faceLandmark68Net.loadFromUri("/models");
    await app.$faceApi.nets.faceExpressionNet.loadFromUri("/models");
    _loadImage();
  };

  app.$startFaceApi = async () => {
    doDetection = true;
    await _sleep(3000);
    // console.log("app.$faceApi.tf.getBackend()", app.$faceApi.tf.getBackend());
    _loadImage();
  };

  app.$stopFaceApi = () => {
    doDetection = false;
  };

  function _fetchStream() {
    return document.getElementById(conferenceStore.status.id);
  }

  const _sleep = (m) => new Promise((resolve) => setTimeout(resolve, m));

  function _getFaceDetectorOptions() {
    return new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
  }
  const _warmUpTensor = () =>
    faceapi.tf.randomUniform([1, inputSize, inputSize, 3], 0, 1, "float32");

  async function _loadImage() {
    if (doDetection || warmUp) {
      const localStream: any = await _fetchStream();
      // console.log("detection localStream", localStream);

      const result: any = await app.$faceApi
        .detectSingleFace(
          warmUp ? _warmUpTensor() : localStream,
          _getFaceDetectorOptions(),
        )
        .withFaceExpressions();
      warmUp = false;
      // console.log("detectiondetection", result);
      if (result) {
        detectionStore.updateExpression(result.expressions);
      }
    }
    await _sleep(2000);
    // Continuously detecting
    await _loadImage();
  }
};
