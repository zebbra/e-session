import consola from "consola";
import FaceApiWorker from "~/assets/js/face.api.worker.js";
import { conferenceStore, detectionStore } from "~/store";

export default ({ app }) => {
  const faceApiWorker = new FaceApiWorker();
  let doDetection = false;

  function _workerResponseHandler(e) {
    consola.log("[WORKER REPONSE]", e);
    const data = e.data;
    if (data.cmd === "detected") {
      consola.log(data.result);
      detectionStore.updateExpression(data.result.expressions);
      window.requestAnimationFrame(app.$runFaceApi);
    } else {
      consola.log(e.data);
    }
  }

  app.$initFaceApi = () => {
    faceApiWorker.addEventListener("message", _workerResponseHandler);
    faceApiWorker.postMessage({ cmd: "init" });
  };

  app.$runFaceApi = () => {
    doDetection = true;
    if (doDetection) {
      const media = _fetchStream();
      consola.log("mediamediamediamediamedia", media);
      const w = media.width;
      const h = media.height;
      const imgData = media.getContext("2d").getImageData(0, 0, w, h);
      consola.log("imgDataimgDataimgData", imgData);
      const { height, width, data } = imgData;
      faceApiWorker.postMessage({ cmd: "detect", data, width, height }, [
        data.buffer,
      ]);
    }
  };

  app.$stopFaceApi = () => {
    doDetection = false;
  };

  function _fetchStream() {
    const video = document.getElementById(conferenceStore.status.id);
    const w = video.videoWidth > 0 ? video.videoWidth : 100;
    const h = video.videoHeight > 0 ? video.videoHeight : 100;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(video, 0, 0, w, h);
    return canvas;
  }
};
