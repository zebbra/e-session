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
    app.$jitsi.mediaDevices.addEventListener(
      app.$jitsi.events.mediaDevices.DEVICE_LIST_CHANGED,
      () => _onDeviceListChanged(),
    );
    app.$jitsi.mediaDevices.addEventListener(
      app.$jitsi.events.mediaDevices.PERMISSION_PROMPT_IS_SHOWN,
      (type: string) => _onDevicePremissionPropmtShown(type),
    );
    app.$connection.connect();
  };

  app.$closeJitsiConnection = () => {
    app.$localTracks.value.localStream.video.dispose();
    app.$localTracks.value.localStream.audio.dispose();
    Vue.delete(app.$localTracks.value.localStream, "video");
    Vue.delete(app.$localTracks.value.localStream, "audio");
    app.$room.leave();
    app.$connection.disconnect();
    app.$room = null;
    app.$connection = null;
    conferenceStore.updateJoined(false);
  };

  app.$onConferenceJoined = () => {
    consola.log("yo haave joned");
  };

  app.$onConnectionSuccess = () => {
    consola.log("onConnectionSuccess");

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
    /* app.$room.on(
      app.$jitsi.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
      (userID, audioLevel) => consola.log(`${userID} - ${audioLevel}`),
    ); */
    // room.on(app.$jitsi.events.conference.PHONE_NUMBER_CHANGED, _ => log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`))
    app.$room.setDisplayName(sessionStore.user.name);
    app.$room.join();
    conferenceStore.setId(app.$room.myUserId());
    conferenceStore.updateJoined(true);
    const options: {
      setup: boolean;
      video: boolean;
      desktop: boolean;
      audio: boolean;
    } = {
      setup: true,
      video: true,
      desktop: false,
      audio: true,
    };
    app.$createLocalTracks(options);
  };

  app.$onConnectionFailed = () => {
    consola.log("connection Failed");
  };

  app.$onDisconnect = () => {
    consola.log("you have disconnected");
  };
  app.$disposeAndRecreateLocalTracks = () => {
    app.$localTracks.value.localStream.video.dispose();
    app.$localTracks.value.localStream.audio.dispose();
    Vue.set(app.$localTracks.value.localStream, "video", null);
    Vue.set(app.$localTracks.value.localStream, "audio", null);
    const options: {
      setup: boolean;
      video: boolean;
      desktop: boolean;
      audio: boolean;
    } = {
      setup: false,
      video: true,
      desktop: false,
      audio: true,
    };
    app.$createLocalTracks(options);
  };

  app.$createLocalTracks = async (options: any) => {
    const devices: Array<string> = [];

    if (options.audio) {
      devices.push("audio");
    }

    if (options.video) {
      devices.push("video");
    }

    if (options.desktop) {
      devices.push("desktop");
    }

    try {
      const tracks = await app.$jitsi.createLocalTracks(
        {
          devices,
        },
        true,
      );
      _onLocalTracks(tracks);
      if (options.setup) {
        conferenceStore.showSetup(true);
      }
    } catch (err) {
      consola.error("Exception createLocalTracks:", err);
      const options: {
        setup: boolean;
        video: boolean;
        desktop: boolean;
        audio: boolean;
      } = {
        setup: true,
        video: false,
        desktop: false,
        audio: true,
      };
      app.$createLocalTracks(options);
      if (options.setup) {
        conferenceStore.showSetup(true);
      }
    }
  };

  app.$disposeAndRecreateVideoTrack = async (id: string) => {
    app.$localTracks.value.localStream.video.dispose();
    Vue.set(app.$localTracks.value.localStream, "video", null);
    try {
      const tracks = await app.$jitsi.createLocalTracks({
        devices: ["video"],
        cameraDeviceId: id,
      });
      _onLocalTracks(tracks);
    } catch (err) {
      consola.error("Exception disposeAndRecreateVideoTrack:", err);
    }
  };

  app.$disposeAndRecreateAudioTrack = async (id: string) => {
    app.$localTracks.value.localStream.audio.dispose();
    Vue.set(app.$localTracks.value.localStream, "audio", null);
    // consola.log(event);
    try {
      const tracks = await app.$jitsi.createLocalTracks({
        devices: ["audio"],
        micDeviceId: id,
      });
      _onLocalTracks(tracks);
    } catch (err) {
      consola.error("Exception disposeAndRecreateAudioTrack:", err);
    }
  };

  app.$switchShare = async () => {
    if (app.$localTracks.value.localStream.video) {
      await app.$localTracks.value.localStream.video.dispose();
    }
    conferenceStore.updateIsSharing(!conferenceStore.status.isSharing);

    try {
      const tracks = await app.$jitsi.createLocalTracks({
        devices: [conferenceStore.status.isSharing ? "desktop" : "video"],
      });
      _onLocalTracks(tracks);
    } catch (err) {
      consola.error("Exception:", err);
    }
  };

  function _onDeviceListChanged() {
    consola.log("device list has changed");
  }

  function _onDevicePremissionPropmtShown(type: string) {
    consola.log("_onDevicePremissionPropmtShown: ", type);
    conferenceStore.premissionPromptShown(type);
  }

  function _onLocalTracks(tracks) {
    // consola.log("tracks: ", tracks);
    for (let i = 0; i < tracks.length; i++) {
      // consola.log("track device id", tracks[i].getDeviceId());
      tracks[i].addEventListener(
        app.$jitsi.events.track.TRACK_MUTE_CHANGED,
        () => consola.log("local track muted"),
      );
      tracks[i].addEventListener(
        app.$jitsi.events.track.LOCAL_TRACK_STOPPED,
        () => _localTrackEnded(),
      );
      tracks[i].addEventListener(
        app.$jitsi.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
        (deviceId: String) =>
          consola.log(`track audio output device was changed to ${deviceId}`),
      );
      const type = tracks[i].getType();
      // consola.log(localTracks);
      if (type === "video") {
        conferenceStore.updateCameraId(tracks[i].getDeviceId());
        Vue.set(app.$localTracks.value.localStream, "video", tracks[i]);
      }
      if (type === "desktop") {
        Vue.set(app.$localTracks.value.localStream, "video", tracks[i]);
      }
      if (type === "audio") {
        tracks[i].addEventListener(
          app.$jitsi.events.track.TRACK_AUDIO_LEVEL_CHANGED,
          (level: number) => conferenceStore.updateLocalAudioLevel(level),
        );
        conferenceStore.updateOuputId(
          app.$jitsi.mediaDevices.getAudioOutputDevice(),
        );
        conferenceStore.updateMicId(tracks[i].getDeviceId());
        Vue.set(app.$localTracks.value.localStream, "audio", tracks[i]);
      }
    }
    consola.log("onLocalTracks done");
    if (conferenceStore.status.isSpeaker) {
      app.$room.addTrack(app.$localTracks.value.localStream.video);
      app.$room.addTrack(app.$localTracks.value.localStream.audio);
    }
  }

  function _localTrackEnded() {
    //  If you were screensharing the local track stop indicates you are not anymore
    consola.log(
      "_localTrackEnded, isSharing: ",
      conferenceStore.status.isSharing,
    );
    if (conferenceStore.status.isSharing) {
      consola.log("stop sharing");
      app.$switchShare();
    }
  }

  function _onUserLeft(id: string) {
    consola.log(id);
  }

  function _onRemoteTrackAdd(track: any) {
    consola.log("onRemoteTrackAdd", track);
    let id: string = "";
    if (track.isLocal()) {
      id = "localStream";
    } else {
      id = track.getParticipantId();
    }
    // consola.log("id: ", id);
    if (!app.$remoteTracks.value[id]) {
      Vue.set(app.$remoteTracks.value, id, ref({}));
    }

    track.addEventListener(
      app.$jitsi.events.track.TRACK_MUTE_CHANGED,
      (track: any) => _onRemoteTrackMuted(track),
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
    consola.log("onRemoteTrackRemove track: ", track);
    // const id = track.getParticipantId();
    const type = track.getType();

    let id: string = "";
    if (track.isLocal()) {
      id = "localStream";
    } else {
      id = track.getParticipantId();
    }

    if (app.$remoteTracks.value[id]) {
      track.removeEventListener(
        app.$jitsi.events.track.TRACK_MUTE_CHANGED,
        (track: any) => _onRemoteTrackMuted(track),
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

      if (
        !app.$remoteTracks.value[id].value.video &&
        !app.$remoteTracks.value[id].value.audio
      ) {
        Vue.delete(app.$remoteTracks.value, id);
      }
    }
  }

  function _onRemoteTrackMuted(track: any) {
    const type = track.getType();
    let id: string = "";
    if (track.isLocal()) {
      id = "localStream";
    } else {
      id = track.getParticipantId();
    }
    const muted = track.isMuted();
    consola.log(`${type} track from participant "${id}": muted="${muted}"`);
    if (type === "video") {
    }
    if (type === "audio") {
    }
  }
};
