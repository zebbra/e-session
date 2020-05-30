import { ref } from "@vue/composition-api";
import consola from "consola";
import Vue from "vue";
import { roomStore, sessionStore, conferenceStore } from "~/store";
import { options, initOptions, confOptions } from "~/utils/jitsi";

export default ({ app }) => {
  const jitsi = (window as any).JitsiMeetJS;
  app.$jitsi = jitsi;
  app.$connection = null;
  app.$localTracks = ref({
    localStream: ref({ video: null, audio: null }),
  });
  app.$remoteTracks = ref({});
  app.$room = null;

  app.$initJitsi = () => {
    app.$jitsi.setLogLevel(app.$jitsi.logLevels.WARN);
    app.$jitsi.init(initOptions);

    app.$connection = new app.$jitsi.JitsiConnection(null, null, options);
    app.$connection.addEventListener(
      app.$jitsi.events.connection.CONNECTION_ESTABLISHED,
      () => app.$onConnectionSuccess(),
    );
    app.$connection.addEventListener(
      app.$jitsi.events.connection.CONNECTION_FAILED,
      () => app.$onConnectionFailed(),
    );
    app.$connection.addEventListener(
      app.$jitsi.events.connection.CONNECTION_DISCONNECTED,
      () => app.$onDisconnect(),
    );
    app.$connection.connect();
  };

  app.$onConferenceJoined = () => {
    consola.log("yo haave joned");
  };

  app.$onConnectionSuccess = () => {
    consola.log("onConnectionSuccess");
    conferenceStore.showSetup(true);

    app.$room = app.$connection.initJitsiConference(
      roomStore.room.name.toLowerCase(),
      confOptions,
    );
    app.$room.on(app.$jitsi.events.conference.TRACK_ADDED, (track: any) =>
      _onRemoteTrackAdd(track),
    );
    app.$room.on(app.$jitsi.events.conference.TRACK_REMOVED, (track: any) =>
      _onRemoteTrackRemove(track),
    );
    app.$room.on(app.$jitsi.events.conference.CONFERENCE_JOINED, () =>
      app.$onConferenceJoined(),
    );
    app.$room.on(app.$jitsi.events.conference.USER_JOINED, (id: any) => {
      consola.log("user join", id);
    });
    app.$room.on(app.$jitsi.events.conference.USER_LEFT, (id: string) =>
      _onUserLeft(id),
    );
    // room.on(app.$jitsi.events.conference.TRACK_MUTE_CHANGED, track => consola.log(`${track.getType()} - ${track.isMuted()}`))
    // room.on(app.$jitsi.events.conference.DISPLAY_NAME_CHANGED, (userID, displayName) => log(`${userID} - ${displayName}`))
    app.$room.on(
      app.$jitsi.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
      (userID, audioLevel) => consola.log(`${userID} - ${audioLevel}`),
    );
    // room.on(app.$jitsi.events.conference.PHONE_NUMBER_CHANGED, _ => log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`))
    app.$room.setDisplayName(sessionStore.user.name);
    app.$room.join();
    conferenceStore.setId(app.$room.myUserId());
  };

  app.$onConnectionFailed = () => {
    consola.log("connection Failed");
  };

  app.$onDisconnect = () => {
    consola.log("you have disconnected");
  };

  function _onUserLeft(id: string) {
    consola.log(id);
  }

  function _onRemoteTrackAdd(track: any) {
    consola.log("onRemoteTrackAdd", track);
    // if (track.isLocal()) return

    const id = track.getParticipantId();
    if (!app.$remoteTracks.value[id]) {
      Vue.set(app.$remoteTracks.value, id, ref({}));
    }

    track.addEventListener(
      app.$jitsi.events.track.TRACK_AUDIO_LEVEL_CHANGED,
      (audioLevel: any) => consola.log(`Audio Level remote: ${audioLevel}`),
    );
    track.addEventListener(app.$jitsi.events.track.TRACK_MUTE_CHANGED, () =>
      consola.log("remote track muted"),
    );
    track.addEventListener(app.$jitsi.events.track.LOCAL_TRACK_STOPPED, () =>
      consola.log("remote track stoped"),
    );
    track.addEventListener(
      app.$jitsi.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
      (deviceId: any) =>
        consola.log(`track audio output device was changed to ${deviceId}`),
    );

    const type = track.getType();
    if (type === "video") {
      Vue.set(app.$remoteTracks.value[id].value, "video", track);
      consola.log(
        "onRemoteTrackAdd type video",
        app.$remoteTracks.value[id].value,
      );
    }
    if (type === "audio") {
      Vue.set(app.$remoteTracks.value[id].value, "audio", track);
      consola.log(
        "onRemoteTrackAdd type audio",
        app.$remoteTracks.value[id].value,
      );
    }
  }

  function _onRemoteTrackRemove(track: any) {
    consola.log("onRemoteTrackRemove", track);
    const id = track.getParticipantId();
    const type = track.getType();
    if (app.$remoteTracks.value[id]) {
      track.removeEventListener(
        app.$jitsi.events.track.TRACK_AUDIO_LEVEL_CHANGED,
        (audioLevel: any) => consola.log(`Audio Level remote: ${audioLevel}`),
      );
      track.removeEventListener(
        app.$jitsi.events.track.TRACK_MUTE_CHANGED,
        () => consola.log("remote track muted"),
      );
      track.removeEventListener(
        app.$jitsi.events.track.LOCAL_TRACK_STOPPED,
        () => consola.log("remote track stoped"),
      );
      track.removeEventListener(
        app.$jitsi.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
        (deviceId: any) =>
          consola.log(`track audio output device was changed to ${deviceId}`),
      );

      if (type === "video") {
        Vue.delete(app.$remoteTracks.value[id].value, "video");
      }
      if (type === "audio") {
        Vue.delete(app.$remoteTracks.value[id].value, "audio");
      }
    }
  }
  /* function onUserLeft(id: string) {
      consola.log("onUserLeft", id);
      context.root.$delete(remoteTracks.value, id);
    } */

  /* function endCall() {
      consola.log("endcall");
      if (room) {
        localTracks.value.value.localStream.video.dispose();
        localTracks.value.value.localStream.audio.dispose();
        context.root.$delete(localTracks.value.value.localStream, "video");
        context.root.$delete(localTracks.value.value.localStream, "audio");
        room.leave();
        connection.disconnect();
        room = null;
        connection = null;
        conferenceStore.updateJoined(false);
        context.root.$options.router!.push({ path: "/meeting" });
      }
    } */
};
