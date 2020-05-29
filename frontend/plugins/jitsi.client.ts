import { ref } from "@vue/composition-api";

export default ({ app }) => {
  const jitsi = (window as any).JitsiMeetJS;
  app.$jitsi = jitsi;
  app.$connection = null;
  app.$localTracks = ref({
    localStream: ref({ video: null, audio: null }),
  });
  app.$remoteTracks = ref({});
  app.$room = null;
};
