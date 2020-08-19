import { useMutation, useSubscription } from "@vue/apollo-composable";
// import { Ref } from "@vue/composition-api";
import { roomStore } from "~/store";
import { mutations, subscriptions } from "~/apollo";
import { IUser, IRoom } from "~/types";

export function useSetJid() {
  return useMutation(mutations.user.setJid, {
    /* update: (_cache, { data }) => {
      // roomStore.updateUser(data.join);
    }, */
  });
}

export function useOnUserUpdate(room: IRoom) {
  if (process.browser) {
    const { onResult } = useSubscription<{ user: IUser }>(
      subscriptions.user.onUserUpdate,
      { roomId: room.id },
    );

    onResult((result) => {
      console.log("useOnUserUpdate: ", result);
      roomStore.updateUser(result.data.user);
      /* if (result.data.user.id !== roomStore.) {
        roomStore.addUser(result.data.roomJoined);
      } */
    });
  }
}
