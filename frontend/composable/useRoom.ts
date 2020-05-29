import { useMutation, useSubscription } from "@vue/apollo-composable";
import { Ref } from "@vue/composition-api";
import { roomStore, sessionStore } from "~/store";
import { mutations, subscriptions } from "~/apollo";
import { IUser, IRoom } from "~/types";

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

export function useLeave(user: Ref<IUser>, room: Ref<IRoom>) {
  return useMutation(mutations.room.leaveRoom, () => ({
    variables: {
      userId: user.value.id,
      roomId: room.value.id,
    },
    update: () => {
      roomStore.clearRoom();
    },
  }));
}

export function useJoin(user: Ref<IUser>, room: Ref<IRoom>) {
  return useMutation(mutations.room.joinRoom, () => ({
    variables: {
      userId: user.value.id,
      roomId: room.value.id,
    },
  }));
}

export function useRaiseHand(user: Ref<IUser>, room: Ref<IRoom>) {
  return useMutation(mutations.room.raiseHand, () => ({
    variables: {
      userId: user.value.id,
      roomId: room.value.id,
    },
  }));
}

export function useLowerHand(user: Ref<IUser>, room: Ref<IRoom>) {
  return useMutation(mutations.room.lowerHand, () => ({
    variables: {
      userId: user.value.id,
      roomId: room.value.id,
    },
  }));
}

export function useSignal(user: Ref<IUser>, room: Ref<IRoom>) {
  if (process.browser) {
    useSubscription(subscriptions.room.signal, () => ({
      userId: user.value && user.value.id,
      roomId: room.value && room.value.id,
    }));
  }
}

export function useOnJoined(user: Ref<IUser>, room: Ref<IRoom>) {
  if (process.browser) {
    const { onResult } = useSubscription<{ roomJoined: IUser }>(
      subscriptions.room.onRoomJoined,
      () => ({
        userId: user.value && user.value.id,
        roomId: room.value && room.value.id,
      }),
    );

    onResult((result) => {
      roomStore.addUser(result.data.roomJoined);
    });
  }
}

export function useOnLeft(user: Ref<IUser>, room: Ref<IRoom>) {
  if (process.browser) {
    const { onResult } = useSubscription<{ roomLeft: IUser }>(
      subscriptions.room.onRoomLeft,
      () => ({
        userId: user.value && user.value.id,
        roomId: room.value && room.value.id,
      }),
    );

    onResult((result) => {
      roomStore.removeUser(result.data.roomLeft);
    });
  }
}

export function useOnHandMoved(user: Ref<IUser>, room: Ref<IRoom>) {
  if (process.browser) {
    const { onResult } = useSubscription<{ handMoved: IUser }>(
      subscriptions.room.onHandMoved,
      () => ({
        userId: user.value && user.value.id,
        roomId: room.value && room.value.id,
      }),
    );

    onResult((result) => {
      roomStore.handMoved(result.data.handMoved);
      if (result.data.handMoved.id === sessionStore.user.id) {
        sessionStore.handMoved();
      }
    });
  }
}
