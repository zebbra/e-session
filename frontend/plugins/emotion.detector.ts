// import { ref } from "@vue/composition-api";
// import consola from "consola";
// import Vue from "vue";
// eslint-disable-next-line import/no-webpack-loader-syntax
import createTasks from "workerize-loader!~/shared/face.api";
import { conferenceStore, detectionStore } from "~/store";
// import { options, initOptions, confOptions } from "~/utils/jitsi";
// import { handleGum } from "~/utils/gumErrorHandling";
// import { useEndShare } from "~/composable/useRoom";

export default ({ app }) => {
  let doDetection: boolean = false;
  const tasks = createTasks();

  app.$initFaceApi = async () => {
    await tasks.initFaceApi();
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
    const video: any = document.getElementById(conferenceStore.status.id);
    // const mediaStream = element.captureStream();

    // const msg = JSON.parse(JSON.stringify(element));
    console.log("videovideo", video);
    const w = video.videoWidth > 0 ? video.videoWidth : 100;
    const h = video.videoHeight > 0 ? video.videoHeight : 100;
    const canvas = new OffscreenCanvas(100, 100);
    canvas.width = w;
    canvas.height = h;

    // console.log("canvas.widthcanvas.width", canvas.width);
    // console.log("canvas.height", canvas.height);

    // const ctx = canvas.getContext("2d");
    // ctx.drawImage(element, 0, 0);
    canvas.getContext("2d").drawImage(video, 0, 0, w, h);
    // console.log("blahblahblahblah", canvas);
    const data = {
      imgData: canvas.getContext("2d").getImageData(0, 0, w, h),
      w,
      h,
    };
    return data;
  }

  const _sleep = (m) => new Promise((resolve) => setTimeout(resolve, m));

  async function _loadImage() {
    if (doDetection) {
      const imageData: any = await _fetchStream();
      // console.log("detection localStream", localStream);
      const result: any = await tasks.detect(imageData);
      // console.log("detectiondetection", result);
      if (result) {
        detectionStore.updateExpression(result.expressions);
      }
    }
    // await _sleep(2000);
    // Continuously detecting
    await _loadImage();
  }
};
