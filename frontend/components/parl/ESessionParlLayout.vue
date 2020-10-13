<template>
  <div>
    <v-row v-if="member" class="member">
      <div
        v-for="(value, key) in membersTracks"
        :key="key"
        class="participantWrapper"
      >
        <h4>Member</h4>
        <e-session-local-peer
          v-if="key === 'localStream'"
          class="peer"
          :media-tracks="value"
        />
        <e-session-remote-peer v-else class="peer" :media-tracks="value" />
      </div>
    </v-row>
    <v-row class="speaker justify-center">
      <div
        v-for="(value, key) in speakersTracks"
        :key="key"
        :class="peerWrapperClassName"
      >
        <h4>Speaker</h4>
        <e-session-local-peer
          v-if="key === 'localStream'"
          class="peer"
          :media-tracks="value"
        />
        <e-session-remote-peer v-else class="peer" :media-tracks="value" />
      </div>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, useContext } from "nuxt-composition-api";
import { conferenceStore, roomStore } from "~/store";
import { keepProps } from "~/utils/helpers";

export default defineComponent({
  name: "ESessionParlLayout",
  head: {},
  components: {
    ESessionRemotePeer: () =>
      import("~/components/conference/ESessionRemotePeer.vue"),
    ESessionLocalPeer: () =>
      import("~/components/conference/ESessionLocalPeer.vue"),
  },
  setup() {
    const { app } = useContext();

    const participants: any = computed(() => {
      if (conferenceStore.status.isSpeaker) {
        return { ...app.$localTracks.value, ...app.$remoteTracks.value };
      } else {
        return app.$remoteTracks.value;
      }
    });

    const speakers: any = computed(() => {
      return roomStore.room.users.filter((item) => {
        if (item.conferenceJoined && item.role === "moderator") {
          return item.jid;
        }
      });
    });

    const members: any = computed(() => {
      return roomStore.room.users.filter((item) => {
        if (item.conferenceJoined && item.role === "user") {
          return item.jid;
        }
      });
    });

    const membersTracks: any = computed(() => {
      if (
        members.value.length > 0 &&
        Object.keys(participants.value).length > 0
      ) {
        // console.log(speakerJids.value.length);
        // console.log(Object.keys(participants.value).length);
        const membersJids = members.value.map((item) => {
          let jid = item.jid;
          if (jid === conferenceStore.status.id) {
            jid = "localStream";
          }
          return jid;
        });
        // console.log("keepProps(participants.value, membersJids);", keepProps(participants.value, membersJids))
        return keepProps(participants.value, membersJids);
      } else {
        return [];
      }
    });

    const speakersTracks: any = computed(() => {
      if (
        speakers.value.length > 0 &&
        Object.keys(participants.value).length > 0
      ) {
        // console.log(speakerJids.value.length);
        // console.log(Object.keys(participants.value).length);
        const speakerJids = speakers.value.map((item) => {
          let jid = item.jid;
          if (jid === conferenceStore.status.id) {
            jid = "localStream";
          }
          return jid;
        });
        // console.log("keepProps(participants.value, speakerJids);", keepProps(participants.value, speakerJids))
        return keepProps(participants.value, speakerJids);
      } else {
        return [];
      }
    });

    const peerWrapperClassName = computed(() => {
      if (Object.keys(membersTracks.value).length > 0) {
        return "with-member";
      } else {
        return "with-no-member";
      }
    });

    const member: any = computed(() => {
      if (Object.keys(membersTracks.value).length > 0) {
        return true;
      } else {
        return false;
      }
    });

    return {
      membersTracks,
      speakersTracks,
      member,
      participants,
      peerWrapperClassName,
    };
  },
});
</script>

<style scoped>
.with-member {
  width: 250px;
}
.with-no-member {
  width: 100%;
}
.peer {
  border-radius: 5px;
  width: 100%;
  overflow: hidden;
  margin-right: 5px;
  margin-left: 5px;
  margin-top: 5px;
  background-color: rgba(39, 39, 39, 0.5);
  backdrop-filter: blur(5px) contrast(0.8);
}
.participantWrapper {
  width: 100%;
}
</style>
