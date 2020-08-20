import { ref } from "@vue/composition-api";
import consola from "consola";
import Vue from "vue";
import { roomStore, sessionStore, conferenceStore } from "~/store";
import { options, initOptions, confOptions } from "~/utils/jitsi";
import { handleGum } from "~/utils/gumErrorHandling";

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
    if (app.$localTracks.value.localStream) {
      app.$localTracks.value.localStream.video.dispose();
      app.$localTracks.value.localStream.audio.dispose();
      Vue.delete(app.$localTracks.value.localStream, "video");
      Vue.delete(app.$localTracks.value.localStream, "audio");
    }
    if (app.$room) {
      app.$room.leave();
      app.$room = null;
    }
    if (app.$connection) {
      app.$connection.disconnect();
      app.$connection = null;
    }
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
    app.$room.on(
      app.$jitsi.events.conference.DISPLAY_NAME_CHANGED,
      (userID: string, displayName: string) =>
        consola.log(`${userID} - ${displayName}`),
    );
    app.$room.on(app.$jitsi.events.conference.TALK_WHILE_MUTED, () =>
      consola.log("you are talking while muted"),
    );
    /* app.$room.on(
      app.$jitsi.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
      (userID, audioLevel) => consola.log(`${userID} - ${audioLevel}`),
    ); */
    // room.on(app.$jitsi.events.conference.PHONE_NUMBER_CHANGED, _ => log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`))
    app.$room.setDisplayName(sessionStore.user.name);
    app.$room.join();
    conferenceStore.setId(app.$room.myUserId());
    conferenceStore.updateJoined(true);
    app.$createLocalTracks({ audio: true, video: true, setup: true });
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
        _getLocalDevices().then(() => {
          conferenceStore.showSetup(true);
        });
      }
    } catch (err) {
      if (err.gum) {
        handleGum(err);
      } else {
        consola.error("Exception createLocalTracks:", err);
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
      if (err.name === "gum.chrome_extension_user_canceled") {
        app.$switchShare();
      } else {
        consola.error("Exception switchShare:", err);
      }
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
        (track: any) => _onLocalTrackMuted(track),
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
        // If cam was muted then we mute the stream if type is not desktop (screen sharing)
        if (
          conferenceStore.status.camMuted &&
          tracks[i].videoType !== "desktop"
        ) {
          tracks[i].mute();
        }
        // if (tracks[i].videoType === "desktop") {
        // conferenceStore.updatePresenterTracks("localStream");
        // }
        conferenceStore.updateCameraId(tracks[i].getDeviceId());
        Vue.set(app.$localTracks.value.localStream, "video", tracks[i]);
      }
      if (type === "audio") {
        if (conferenceStore.status.micMuted) {
          tracks[i].mute();
        }
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

  function _getLocalDevices() {
    return new Promise((resolve, reject) => {
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

      app.$jitsi.mediaDevices.isDevicePermissionGranted().then(() => {
        if (app.$jitsi.mediaDevices.isDeviceListAvailable()) {
          app.$jitsi.mediaDevices.enumerateDevices((devices) => {
            // consola.log("devices: ", devices);
            // consola.log("audiooutput", devices.filter((d) => d.kind === "audiooutput"));
            conferenceStore.updateOutputDevices(
              devices.filter((d) => d.kind === "audiooutput"),
            );
            conferenceStore.updateMicrophoneDevices(
              devices.filter((d) => d.kind === "audioinput"),
            );
            conferenceStore.updateCameraDevices(
              devices.filter((d) => d.kind === "videoinput"),
            );
            if (devices.filter((d) => d.kind === "videoinput").length <= 0) {
              options.video = false;
            }
            if (devices.filter((d) => d.kind === "audioinput").length <= 0) {
              options.audio = false;
            }
          });
          resolve(options);
        } else {
          reject(Error("It broke"));
          // make better error handling
        }
      });
    });
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
    if (track.isLocal()) {
      return;
    }
    consola.log("onRemoteTrackAdd", track);
    const id: string = track.getParticipantId();

    // consola.log("id: ", id);
    if (!app.$remoteTracks.value[id]) {
      Vue.set(app.$remoteTracks.value, id, ref({}));
    }

    track.addEventListener(
      app.$jitsi.events.track.TRACK_MUTE_CHANGED,
      (track: any) => _onRemoteTrackMuted(track),
    );
    /*     track.addEventListener(app.$jitsi.events.track.LOCAL_TRACK_STOPPED, () =>
      consola.log("local track stoped"),
    ); */
    track.addEventListener(
      app.$jitsi.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
      (deviceId: any) =>
        consola.log(`track audio output device was changed to ${deviceId}`),
    );

    const type = track.getType();
    if (type === "video") {
      if (track.isMuted()) {
        conferenceStore.updateMutedVideoTracks(track.getParticipantId());
      }
      // If track is a dekstop share add participant id to presenter store
      /* if (track.videoType === "desktop") {
        conferenceStore.updatePresenterTracks(id);
      } */
      Vue.set(app.$remoteTracks.value[id].value, "video", track);
      consola.log(
        "onRemoteTrackAdd type video",
        app.$remoteTracks.value[id].value,
      );
    }
    if (type === "audio") {
      if (track.isMuted()) {
        conferenceStore.updateMutedAudioTracks(track.getParticipantId());
      }
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

    const id: string = track.getParticipantId();

    if (app.$remoteTracks.value[id]) {
      track.removeEventListener(
        app.$jitsi.events.track.TRACK_MUTE_CHANGED,
        (track: any) => _onRemoteTrackMuted(track),
      );

      /* track.removeEventListener(
        app.$jitsi.events.track.LOCAL_TRACK_STOPPED,
        () => consola.log("remote track stoped"),
      ); */

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

  function _onLocalTrackMuted(track: any) {
    consola.log("_onLocalTrackMuted: ", track);
    const id = conferenceStore.status.id;
    const muted = track.isMuted();
    const type = track.getType();

    consola.log(
      `local ${type} track from participant "${id}": muted="${muted}"`,
    );

    if (type === "video") {
      conferenceStore.updateMutedVideoTracks(id);
    }
    if (type === "audio") {
      conferenceStore.updateMutedAudioTracks(id);
    }
  }

  function _onRemoteTrackMuted(track: any) {
    if (track.isLocal()) {
      return;
    }
    const type = track.getType();
    const id = track.getParticipantId();
    const muted = track.isMuted();

    consola.log(`${type} track from participant "${id}": muted="${muted}"`);
    if (type === "video") {
      conferenceStore.updateMutedVideoTracks(id);
    }
    if (type === "audio") {
      conferenceStore.updateMutedAudioTracks(id);
    }
  }
};
