import { Ref } from "@vue/composition-api";
import { useMutation, useSubscription } from "@vue/apollo-composable";
import { mutations, subscriptions } from "~/apollo";
import { IRoom, IUser, IMessage } from "~/types";
import { roomStore } from "~/store";

export function useSend(room: IRoom, user: IUser, message: Ref<string>) {
  return useMutation(mutations.message.postMessage, () => ({
    variables: {
      room: room.name,
      author: user.id,
      text: message.value,
    },
  }));
}

export function useOnMessagePosted(room: IRoom) {
  if (process.browser) {
    const { onResult } = useSubscription<{ messagePosted: IMessage }>(
      subscriptions.message.onMessagePosted,
      () => ({
        room: room.name,
      }),
    );

    onResult((result) => {
      roomStore.addMessage(result.data.messagePosted);
    });
  }
}
