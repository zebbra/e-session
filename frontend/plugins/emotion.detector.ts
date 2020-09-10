// import { ref } from "@vue/composition-api";
// import consola from "consola";
// import Vue from "vue";
import * as faceapi from "face-api.js";
import { conferenceStore, detectionStore } from "~/store";
// import { options, initOptions, confOptions } from "~/utils/jitsi";
// import { handleGum } from "~/utils/gumErrorHandling";
// import { useEndShare } from "~/composable/useRoom";

export default ({ app }) => {
  let doDetection: boolean = false;
  app.$faceApi = faceapi;

  app.$initFaceApi = async () => {
    await app.$faceApi.nets.ssdMobilenetv1.loadFromUri("/models");
    // await app.$faceApi.nets.faceLandmark68Net.loadFromUri("/models");
    await app.$faceApi.nets.faceExpressionNet.loadFromUri("/models");
  };

  app.$startFaceApi = () => {
    doDetection = true;
    _loadImage();
  };

  app.$stopFaceApi = () => {
    doDetection = false;
  };

  function _fetchStream() {
    return document.getElementById(conferenceStore.status.id);
  }

  const _sleep = (m) => new Promise((resolve) => setTimeout(resolve, m));

  async function _loadImage() {
    if (doDetection) {
      const localStream: any = await _fetchStream();
      const result: any = await app.$faceApi
        .detectSingleFace(localStream)
        .withFaceExpressions();
      // console.log("detectiondetection", result);
      if (result) {
        detectionStore.updateExpression(result.expressions);
      }
    }
    await _sleep(3000);
    // Continuously detecting
    await _loadImage();
  }
};
