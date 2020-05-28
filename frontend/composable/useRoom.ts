import { useMutation } from "@vue/apollo-composable";
import { Ref } from "@vue/composition-api";
import { roomStore } from "~/store";
import { mutations } from "~/apollo";
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
