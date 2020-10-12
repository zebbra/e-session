<template>
  <v-container fluid class="d-flex justify-center">
    <e-session-parl class="conference-wrapper" />
    <e-session-parl-toolbar class="toolbar-wrapper" />
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
import { useOnAgendaUpdate } from "~/composable/useAgenda";
import { useOnPoll } from "~/composable/usePoll";
import { useSetJid, useOnUserUpdate } from "~/composable/useUser";
import { useOnMessagePosted } from "~/composable/useMessage";
import { roomStore, sessionStore, conferenceStore } from "~/store";
export default defineComponent({
  name: "Room",
  head: {},
  components: {
    ESessionParl: () => import("~/components/parl/ESessionParl.vue"),
    ESessionParlToolbar: () =>
      import("~/components/parl/ESessionParlToolbar.vue"),
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
    useOnPoll(roomRef.value);
    useOnAgendaUpdate(roomRef.value);

    const { mutate: join } = useJoin(userRef.value, roomRef.value);
    join();
    const { mutate: setJid } = useSetJid();

    // const { mutate: setRole } = useSetRole();
    // const role = computed(() => sessionStore.userRole);
    // setRole({ userId: userRef.value.id, role: role.value });

    conferenceStore.updateDisplayName(userRef.value.name);
    conferenceStore.updateRoomName(roomRef.value.name);

    useUsersInConference(roomRef.value);

    watch(
      () => conferenceStore.addedParticipants,
      (newVal) => {
        const speaker = newVal.filter((item) => item === sessionStore.user.id);
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
  /* width: auto; */
  /* height: auto; */
}
</style>
