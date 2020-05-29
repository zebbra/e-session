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
import Vue from "vue";
import { defineComponent, useMeta, ref, computed } from "nuxt-composition-api";
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
  setup(props, context) {
    const roomName: any = computed(() => context.root.$route.params.id);
    const displayName: any = computed(
      () => conferenceStatusStore.status.displayName,
    );
    const settingsDialog = computed(
      () => conferenceStatusStore.deviceSettingsVisible,
    );
    const userId: any = ref(1);
    const localTracks: any = computed(() => context.root.$localTracks);
    const remoteTracks: any = ref({});

    useMeta({ title: roomName.value });

    const peerWrapperClassName = computed(() => {
      const numOfPeers = Object.keys(remoteTracks.value).length;
      // console.log("remoteTracks lenght: ", Object.keys(remoteTracks.value).length)
      if (numOfPeers > 0) {
        return "grid-" + numOfPeers;
      } else if (numOfPeers > 6) {
        return "grid-6";
      } else {
        return "grid-1";
      }
    });

    let jitsi: any;
    let connection: any;
    let room: any;

    if (process.browser) {
      connection = context.root.$connection;
      jitsi = context.root.$jitsi;

      room = connection.initJitsiConference(
        roomName.value.toLowerCase(),
        confOptions,
      );
      room.on(jitsi.events.conference.TRACK_ADDED, (track: any) =>
        onRemoteTrackAdd(track),
      );
      room.on(jitsi.events.conference.TRACK_REMOVED, (track: any) =>
        onRemoteTrackRemove(track),
      );
      room.on(jitsi.events.conference.CONFERENCE_JOINED, () =>
        onConferenceJoined(),
      );
      room.on(jitsi.events.conference.USER_JOINED, (id: any) => {
        console.log("user join", id);
        context.root.$set(remoteTracks.value, id, ref({}));
      });
      room.on(jitsi.events.conference.USER_LEFT, (id: string) =>
        onUserLeft(id),
      );
      // room.on(jitsi.events.conference.TRACK_MUTE_CHANGED, track => console.log(`${track.getType()} - ${track.isMuted()}`))
      // room.on(jitsi.events.conference.DISPLAY_NAME_CHANGED, (userID, displayName) => log(`${userID} - ${displayName}`))
      room.on(
        jitsi.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
        (userID, audioLevel) => console.log(`${userID} - ${audioLevel}`),
      );
      // room.on(jitsi.events.conference.PHONE_NUMBER_CHANGED, _ => log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`))
      room.setDisplayName(displayName);
      room.join();
      Vue.prototype.$room = room;
    }

    function onRemoteTrackAdd(track: any) {
      // console.log("onRemoteTrackAdd", track)
      // if (track.isLocal()) return

      const id = track.getParticipantId();
      if (!remoteTracks.value[id]) {
        context.root.$set(remoteTracks.value, id, ref({}));
      }

      track.addEventListener(
        jitsi.events.track.TRACK_AUDIO_LEVEL_CHANGED,
        (audioLevel: any) => console.log(`Audio Level remote: ${audioLevel}`),
      );
      track.addEventListener(jitsi.events.track.TRACK_MUTE_CHANGED, () =>
        console.log("remote track muted"),
      );
      track.addEventListener(jitsi.events.track.LOCAL_TRACK_STOPPED, () =>
        console.log("remote track stoped"),
      );
      track.addEventListener(
        jitsi.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
        (deviceId: any) =>
          console.log(`track audio output device was changed to ${deviceId}`),
      );

      const type = track.getType();
      if (type === "video") {
        context.root.$set(remoteTracks.value[id].value, "video", track);
        // console.log("onRemoteTrackAdd type video", remoteTracks.value[id].value)
      }
      if (type === "audio") {
        context.root.$set(remoteTracks.value[id].value, "audio", track);
        // console.log("onRemoteTrackAdd type audio", remoteTracks.value[id].value)
      }
    }

    function onRemoteTrackRemove(track: any) {
      console.log("onRemoteTrackRemove", track);
      const id = track.getParticipantId();
      const type = track.getType();
      if (remoteTracks.value[id]) {
        track.removeEventListener(
          jitsi.events.track.TRACK_AUDIO_LEVEL_CHANGED,
          (audioLevel: any) => console.log(`Audio Level remote: ${audioLevel}`),
        );
        track.removeEventListener(jitsi.events.track.TRACK_MUTE_CHANGED, () =>
          console.log("remote track muted"),
        );
        track.removeEventListener(jitsi.events.track.LOCAL_TRACK_STOPPED, () =>
          console.log("remote track stoped"),
        );
        track.removeEventListener(
          jitsi.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
          (deviceId: any) =>
            console.log(`track audio output device was changed to ${deviceId}`),
        );

        if (type === "video") {
          context.root.$delete(remoteTracks.value[id].value, "video");
        }
        if (type === "audio") {
          context.root.$delete(remoteTracks.value[id].value, "audio");
        }
      }
    }

    function onConferenceJoined() {
      console.log("onConferenceJoined", localTracks);
      conferenceStatusStore.updateJoined(true);
      /* TODO Desktop and check if stream available */
      room.addTrack(localTracks.value.value.localStream.video);
      room.addTrack(localTracks.value.value.localStream.audio);
    }

    function onUserLeft(id: string) {
      console.log("onUserLeft", id);
      context.root.$delete(remoteTracks.value, id);
    }

    function endCall() {
      console.log("endcall");
      if (room) {
        localTracks.value.value.localStream.video.dispose();
        localTracks.value.value.localStream.audio.dispose();
        context.root.$delete(localTracks.value.value.localStream, "video");
        context.root.$delete(localTracks.value.value.localStream, "audio");
        room.leave();
        connection.disconnect();
        room = null;
        connection = null;
        conferenceStatusStore.updateJoined(false);
        context.root.$options.router!.push({ path: "/meeting" });
      }
    }

    function showSettings() {
      conferenceStatusStore.showDeviceSettings(true);
    }

    return {
      roomName,
      userId,
      remoteTracks,
      localTracks,
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
