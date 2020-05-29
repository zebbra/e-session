<template>
  <!-- <v-row>
    <v-col>
        <span class="info--text">{{ roomName }}</span>
    </v-col>
    <v-col class="localMedia">
      <peer :mediaTracks="localTracks.value.localStream" :displayName="displayName" />
    </v-col>
  </v-row> -->
  <div>
    <v-row class="d-flex justify-center align-center mt-2">
      <v-btn class="ma-2" outlined fab small disabled>
        <v-icon small>mdi-hand-right</v-icon>
      </v-btn>
      <v-btn class="ma-2" outlined fab small color="error" @click="endCall">
        <v-icon small>mdi-phone-hangup</v-icon>
      </v-btn>
      <v-btn class="ma-2" outlined fab small disabled>
        <v-icon small>mdi-monitor</v-icon>
      </v-btn>
      <v-btn class="ma-2" outlined fab small @click="showSettings">
        <v-icon small>mdi-cog</v-icon>
      </v-btn>
    </v-row>
    <div class="my-container">
      <v-row class="d-flex justify-center align-center ma-2">
        <div :class="peerWrapperClassName">
          <peer
            v-for="(value, key) in remoteTracks"
            :key="key"
            class="peer"
            :media-tracks="value"
          />
        </div>
      </v-row>
    </div>
    <v-dialog v-model="settingsDialog" persistent max-width="600">
      <e-session-local-media-settings />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  useMeta,
  ref,
  computed,
  useContext,
} from "nuxt-composition-api";
import consola from "consola";
import { confOptions } from "~/utils/jitsi";
import { conferenceStatusStore } from "~/store";

export default defineComponent({
  name: "Room",
  head: {},
  components: {
    Peer: () => import("~/components/Peer.vue"),
    ESessionLocalMediaSettings: () =>
      import("~/components/ESessionLocalMediaSettings.vue"),
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup() {
    const { app, params, redirect } = useContext();
    const roomName: any = computed(() => params.value.id);
    const displayName: any = computed(
      () => conferenceStatusStore.status.displayName,
    );
    const settingsDialog = computed(
      () => conferenceStatusStore.deviceSettingsVisible,
    );
    const userId: any = ref(1);
    const remoteTracks: any = ref({});

    useMeta({ title: roomName.value });

    const peerWrapperClassName = computed(() => {
      const numOfPeers = Object.keys(remoteTracks.value).length;
      // consola.log("remoteTracks lenght: ", Object.keys(remoteTracks.value).length)
      if (numOfPeers > 0) {
        return "grid-" + numOfPeers;
      } else if (numOfPeers > 6) {
        return "grid-6";
      } else {
        return "grid-1";
      }
    });

    if (process.browser) {
      const room = app.$connection.initJitsiConference(
        roomName.value.toLowerCase(),
        confOptions,
      );
      room.on(app.$jitsi.events.conference.TRACK_ADDED, (track: any) =>
        onRemoteTrackAdd(track),
      );
      room.on(app.$jitsi.events.conference.TRACK_REMOVED, (track: any) =>
        onRemoteTrackRemove(track),
      );
      room.on(app.$jitsi.events.conference.CONFERENCE_JOINED, () =>
        onConferenceJoined(),
      );
      room.on(app.$jitsi.events.conference.USER_JOINED, (id: any) => {
        consola.log("user join", id);
        remoteTracks.value[id] = ref({});
      });
      room.on(app.$jitsi.events.conference.USER_LEFT, (id: string) =>
        onUserLeft(id),
      );
      // room.on(app.$jitsi.events.conference.TRACK_MUTE_CHANGED, track => consola.log(`${track.getType()} - ${track.isMuted()}`))
      // room.on(app.$jitsi.events.conference.DISPLAY_NAME_CHANGED, (userID, displayName) => log(`${userID} - ${displayName}`))
      room.on(
        app.$jitsi.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
        (userID, audioLevel) => consola.log(`${userID} - ${audioLevel}`),
      );
      // room.on(app.$jitsi.events.conference.PHONE_NUMBER_CHANGED, _ => log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`))
      room.setDisplayName(displayName);
      room.join();
      app.$room = room;
    }

    function onRemoteTrackAdd(track: any) {
      // consola.log("onRemoteTrackAdd", track)
      // if (track.isLocal()) return

      const id = track.getParticipantId();
      if (!remoteTracks.value[id]) {
        remoteTracks.value[id] = ref({});
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
        remoteTracks.value[id].value.video = track;
      }
      if (type === "audio") {
        remoteTracks.value[id].value.audio = track;
      }
    }

    function onRemoteTrackRemove(track: any) {
      consola.log("onRemoteTrackRemove", track);
      const id = track.getParticipantId();
      const type = track.getType();
      if (remoteTracks.value[id]) {
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
          remoteTracks.value[id].value.video = null;
        }
        if (type === "audio") {
          remoteTracks.value[id].value.audio = null;
        }
      }
    }

    function onConferenceJoined() {
      consola.log("onConferenceJoined", app.$localTracks);
      conferenceStatusStore.updateJoined(true);
      /* TODO Desktop and check if stream available */
      app.$room.addTrack(app.$localTracks.localStream.video);
      app.$room.addTrack(app.$localTracks.localStream.audio);
    }

    function onUserLeft(id: string) {
      consola.log("onUserLeft", id);
      remoteTracks.value[id] = null;
    }

    function endCall() {
      consola.log("endcall");
      if (app.$room) {
        app.$localTracks.localStream.video.dispose();
        app.$localTracks.localStream.video = null;
        app.$localTracks.localStream.audio.dispose();
        app.$localTracks.localStream.audio = null;
        app.$room.leave();
        app.$connection.disconnect();
        app.$room = null;
        app.$connection = null;
        conferenceStatusStore.updateJoined(false);
        redirect("/meeting");
      }
    }

    function showSettings() {
      conferenceStatusStore.showDeviceSettings(true);
    }

    return {
      roomName,
      userId,
      remoteTracks,
      localTracks: app.$localTracks,
      displayName,
      peerWrapperClassName,
      endCall,
      settingsDialog,
      showSettings,
    };
  },
});
</script>

<style scoped>
.localMedia {
  height: 150px;
}
.peer-wrapper {
  width: 100%;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, 1fr);
  grid-template-rows: repeat(auto-fill, 1fr);
  grid-auto-flow: column;
}
.peer {
  border-radius: 5px;
  justify-self: stretch;
  overflow: hidden;
  min-width: 0;
  margin-right: 5px;
  margin-left: 5px;
  margin-top: 5px;
}
.grid-1 {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-auto-flow: column;
}
.grid-2 {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-auto-flow: column;
}
.grid-3 {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-auto-flow: column;
}
.grid-4 {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, 1fr);
  grid-auto-flow: column;
}
.grid-5 {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-template-rows: repeat(3, 1fr);
  grid-auto-flow: column;
}
.grid-6 {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-template-rows: repeat(2, 1fr);
  grid-auto-flow: column;
}
.my-container {
  height: 100%;
  align-items: center;
  display: flex;
}
</style>
