import { useMutation, useSubscription } from "@vue/apollo-composable";
// import { Ref } from "@vue/composition-api";
// import { use } from "vue/types/umd";
import { pollStore, roomStore } from "~/store";
import { mutations, subscriptions } from "~/apollo";
import { IPoll, IRoom } from "~/types";

export function useCreate(room: IRoom) {
  return useMutation(mutations.poll.createPoll, () => ({
    variables: {
      roomId: room.id,
    },
    /* update: (_cache, { data }) => {
      pollStore.setPoll(data.poll);
    }, */
  }));
}

export function useEnd() {
  return useMutation(mutations.poll.end, () => ({
    variables: {
      pollId: pollStore.poll.id,
    },
    /* update: (_cache, { data }) => {
      pollStore.setPoll(data.poll);
    }, */
  }));
}

export function useVote(id: String, userId: String, vote: String) {
  return useMutation(mutations.poll.vote, () => ({
    variables: {
      id,
      userId,
      vote,
    },
    /* update: (_cache, { data }) => {
      console.log("useVote update", data);
    }, */
  }));
}

export function useDidNotVote(id: String, userId: String) {
  return useMutation(mutations.poll.addDidNot, () => ({
    variables: {
      id,
      userId,
    },
    /* update: (_cache, { data }) => {
      pollStore.setPoll(data.poll);
    }, */
  }));
}

export function useOnPoll(room: IRoom) {
  if (process.browser) {
    const { onResult } = useSubscription<{ poll: IPoll }>(
      subscriptions.poll.onPoll,
      { roomId: room.id },
    );

    onResult((result) => {
      if (result.data.poll.roomId === roomStore.room.id) {
        pollStore.setPoll(result.data.poll);
      }
    });
  }
}

export function useOnPollUpdate(poll: IPoll) {
  if (process.browser) {
    const { onResult } = useSubscription<{ pollUpdate: IPoll }>(
      subscriptions.poll.onPollUpdate,
      { pollId: poll.id },
    );

    onResult((result) => {
      if (result.data.pollUpdate.id === pollStore.poll.id) {
        pollStore.updatePoll(result.data.pollUpdate);
      }
    });
  }
}
