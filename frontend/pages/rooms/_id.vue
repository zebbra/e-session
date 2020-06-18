<template>
  <v-container fluid class="d-flex">
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
} from "~/composable/useRoom";
import { useOnMessagePosted } from "~/composable/useMessage";
import { roomStore, sessionStore, conferenceStore } from "~/store";

export default defineComponent({
  name: "Room",
  head: {},
  components: {
    ESessionConference: () => import("~/components/ESessionConference.vue"),
    ESessionControlToolbar: () =>
      import("~/components/ESessionControlToolbar.vue"),
  },
  setup() {
    const roomRef = computed(() => roomStore.room);
    const userRef = computed(() => sessionStore.user);

    useMeta({ title: roomRef.value.name });

    const { app } = useContext();

    useSignal(userRef.value, roomRef.value);
    useOnJoined(roomRef.value);
    useOnLeft(roomRef.value);
    useOnMessagePosted(roomRef.value);
    useOnHandMoved(roomRef.value);

    const { mutate: join } = useJoin(userRef.value, roomRef.value);
    join();

    conferenceStore.updateDisplayName(userRef.value.name);
    conferenceStore.updateRoomName(roomRef.value.name);

    const usersInConference = useUsersInConference(roomRef.value);

    watch(
      () => usersInConference.value,
      (newVal) => {
        const speaker = newVal.filter(
          (item) => item.id === sessionStore.user.id,
        );
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
  float: right;
  left: 32%;
}
.conference-wrapper {
  min-width: 100%;
  /* min-height: 100%; */
  width: auto;
  /* height: auto; */
}
</style>
