import {
  useMutation,
  useSubscription,
  useQuery,
  useResult,
} from "@vue/apollo-composable";
import { Ref } from "@vue/composition-api";
import { roomStore, sessionStore } from "~/store";
import { queries, mutations, subscriptions } from "~/apollo";
import { IUser, IRoom } from "~/types";

export function useUsersInConference(room: IRoom) {
  const { result: users, subscribeToMore } = useQuery<{
    usersInConference: IUser[];
  }>(queries.room.fetchUsersInConference, () => ({
    room: room.name,
  }));

  if (process.client) {
    subscribeToMore<{}, { conferenceJoined: IUser }>({
      document: subscriptions.user.onConferenceJoined,
      variables: {
        roomId: room.id,
      },
      updateQuery: (previousResult, { subscriptionData }) => {
        roomStore.updateUser(subscriptionData.data.conferenceJoined);
        previousResult.usersInConference.push(
          subscriptionData.data.conferenceJoined,
        );
        return previousResult;
      },
    });

    subscribeToMore<{}, { conferenceLeft: IUser }>({
      document: subscriptions.user.onConferenceLeft,
      variables: {
        roomId: room.id,
      },
      updateQuery: (previousResult, { subscriptionData }) => {
        roomStore.updateUser(subscriptionData.data.conferenceLeft);
        for (let i = previousResult.usersInConference.length - 1; i >= 0; --i) {
          if (
            previousResult.usersInConference[i].id ===
            subscriptionData.data.conferenceLeft.id
          ) {
            previousResult.usersInConference.splice(i, 1);
            i = 0;
          }
        }
        return previousResult;
      },
    });
  }

  return useResult(users, [] as IUser[], (data) => data.usersInConference);
}

export function useCreate(roomName: Ref<string>) {
  return useMutation(mutations.room.createRoom, () => ({
    variables: {
      name: roomName.value,
    },
    update: (_cache, { data }) => {
      roomStore.setRoom(data.createRoom);
    },
  }));
}

export function useLeave(user: IUser, room: IRoom) {
  return useMutation(mutations.room.leaveRoom, {
    variables: {
      userId: user.id,
      roomId: room.id,
    },
    update: () => {
      roomStore.clearRoom();
    },
  });
}

export function useJoin(user: IUser, room: IRoom) {
  return useMutation(mutations.room.joinRoom, {
    variables: {
      userId: user.id,
      roomId: room.id,
    },
    update: (_cache, { data }) => {
      roomStore.addUser(data.join);
    },
  });
}

export function useRaiseHand(user: IUser, room: IRoom) {
  return useMutation(mutations.room.raiseHand, {
    variables: {
      userId: user.id,
      roomId: room.id,
    },
  });
}

export function useLowerHand(user: IUser, room: IRoom) {
  return useMutation(mutations.room.lowerHand, {
    variables: {
      userId: user.id,
      roomId: room.id,
    },
  });
}

export function useSignal(user: IUser, room: IRoom) {
  if (process.browser) {
    useSubscription(subscriptions.room.signal, {
      userId: user.id,
      roomId: room.id,
    });
  }
}

export function useOnJoined(room: IRoom) {
  if (process.browser) {
    const { onResult } = useSubscription<{ roomJoined: IUser }>(
      subscriptions.room.onRoomJoined,
      { roomId: room.id },
    );

    onResult((result) => {
      if (result.data.roomJoined.id !== sessionStore.user.id) {
        roomStore.addUser(result.data.roomJoined);
      }
    });
  }
}

export function useOnLeft(room: IRoom) {
  if (process.browser) {
    const { onResult } = useSubscription<{ roomLeft: IUser }>(
      subscriptions.room.onRoomLeft,
      { roomId: room.id },
    );

    onResult((result) => {
      roomStore.removeUser(result.data.roomLeft);
    });
  }
}

export function useOnHandMoved(room: IRoom) {
  if (process.browser) {
    const { onResult } = useSubscription<{ handMoved: IUser }>(
      subscriptions.room.onHandMoved,
      { roomId: room.id },
    );

    onResult((result) => {
      roomStore.updateUser(result.data.handMoved);
      if (result.data.handMoved.id === sessionStore.user.id) {
        sessionStore.handMoved();
      }
    });
  }
}
