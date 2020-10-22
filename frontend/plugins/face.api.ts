// import consola from "consola";
import FaceApiWorker from "workerize-loader!~/shared/face.api.js"; // eslint-disable-line import/no-webpack-loader-syntax

import { detectionStore } from "~/store";

export default ({ app }) => {
  // const faceApiWorker: any = new FaceApiWorker();
  let doDetection = false;
  const tasks = new FaceApiWorker() as any;
  const _sleep = (m) => new Promise((resolve) => setTimeout(resolve, m));

  app.$runFaceApi = async () => {
    doDetection = true;
    if (doDetection) {
      const media = await _fetchStream();
      const w = media.width;
      const h = media.height;
      const imgData = media.getContext("2d").getImageData(0, 0, w, h);
      const result = await tasks.getPrediction(imgData);
      if (result && result.expressions) {
        detectionStore.updateExpression(result.expressions);
      }
      await _sleep(2000);
      window.requestAnimationFrame(app.$runFaceApi);
    }
  };

  app.$stopFaceApi = () => {
    doDetection = false;
  };

  async function _fetchStream() {
    const constraints = {
      audio: false,
      video: {
        width: { max: 1024 },
        height: { max: 576 },
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const imageCapture = new ImageCapture(stream.getVideoTracks()[0]);
    const imageBitmap = await imageCapture.grabFrame();
    const offscreenCanvas = new OffscreenCanvas(
      imageBitmap.width,
      imageBitmap.height,
    );
    offscreenCanvas.getContext("2d").drawImage(imageBitmap, 0, 0);
    return offscreenCanvas;
  }
};
