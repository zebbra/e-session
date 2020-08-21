<template>
  <v-container fluid class="d-flex justify-center">
    <e-session-conference class="conference-wrapper" />
    <e-session-control-toolbar class="toolbar-wrapper" />
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  useMeta,
  computed,
  useContext,
  watch,
} from "nuxt-composition-api";
import {
  useSignal,
  useOnJoined,
  useOnLeft,
  useJoin,
  useUsersInConference,
  useOnHandMoved,
  useOnShareToggled,
} from "~/composable/useRoom";
import { useSetJid, useOnUserUpdate } from "~/composable/useUser";

import { useOnMessagePosted } from "~/composable/useMessage";
import { roomStore, sessionStore, conferenceStore } from "~/store";

export default defineComponent({
  name: "Room",
  head: {},
  components: {
    ESessionConference: () =>
      import("~/components/conference/ESessionConference.vue"),
    ESessionControlToolbar: () =>
      import("~/components/conference/ESessionControlToolbar.vue"),
  },
  setup() {
    const roomRef = computed(() => roomStore.room);
    const userRef = computed(() => sessionStore.user);
    const jidRef = computed(() => conferenceStore.status.id);

    useMeta({ title: roomRef.value.name });

    const { app } = useContext();

    useSignal(userRef.value, roomRef.value);
    useOnJoined(roomRef.value);
    useOnLeft(roomRef.value);
    useOnMessagePosted(roomRef.value);
    useOnHandMoved(roomRef.value);
    useOnShareToggled(roomRef.value);
    useOnUserUpdate(roomRef.value);

    const { mutate: join } = useJoin(userRef.value, roomRef.value);
    join();
    const { mutate: setJid } = useSetJid();

    conferenceStore.updateDisplayName(userRef.value.name);
    conferenceStore.updateRoomName(roomRef.value.name);

    const usersInConference = useUsersInConference(roomRef.value);

    watch(
      () => usersInConference.value,
      (newVal) => {
        const speaker = newVal.filter(
          (item) => item.id === sessionStore.user.id && item.conferenceJoined,
        );
        console.log("newVal", newVal);
        console.log("esssionStore.user.id", sessionStore.user.id);
        console.log("speaker", speaker);

        if (speaker.length > 0) {
          conferenceStore.updateIsSpeaker(true);
          app.$room.addTrack(app.$localTracks.value.localStream.video);
          app.$room.addTrack(app.$localTracks.value.localStream.audio);
        } else {
          // console.log("you are NOT a speaker: ", speaker);
          // eslint-disable-next-line no-lonely-if
          if (conferenceStore.status.isSpeaker) {
            conferenceStore.updateIsSpeaker(false);
            app.$disposeAndRecreateLocalTracks();
          }
        }
      },
      // watch Options
      {
        lazy: true, // immediate: false
      },
    );

    watch(
      () => jidRef.value,
      (newVal) => {
        if (newVal.length > 0) {
          setJid({ userId: userRef.value.id, jid: newVal });
        }
      },
      {
        lazy: true, // immediate: false
      },
    );

    if (process.browser) {
      app.$initJitsi();
    }
    return {
      room: roomRef,
    };
  },
});
</script>

<style scoped>
.toolbar-wrapper {
  bottom: 60px;
  position: absolute;
  /* float: right; */
  /* left: 32%; */
}
.conference-wrapper {
  min-width: 100%;
  /* min-height: 100%; */
  width: auto;
  /* height: auto; */
}
</style>
