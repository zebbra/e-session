import { reactive } from "@vue/composition-api";

export default ({ app }) => {
  const jitsi = (window as any).JitsiMeetJS;
  app.$jitsi = jitsi;
  app.$localTracks = reactive({
    localStream: { video: null, audio: null },
  });
};
