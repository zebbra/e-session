import consola from "consola";
import { conferenceStore } from "~/store";

function handleGum(err: Error) {
  consola.error(err);
  if (err.name === "gum.permission_denied") {
    conferenceStore.updateErrorFlag(true);
    conferenceStore.updateErrorMsg(err.message);
    conferenceStore.updateErrorResolution(
      "To use this service please allow access to your Camera and/or Microphone",
    );
  }
  // console.log("handleGum", err);
}

export { handleGum };
