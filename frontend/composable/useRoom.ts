import { useQuery, useMutation } from "@vue/apollo-composable";
import { Ref } from "@vue/composition-api";
import { IRoom, IUser } from "~/types";

export function fetchRoom(name: string) {
  const roomTypeQuery = require("~/graphql/room.graphql");

  return useQuery<{
    room: IRoom;
  }>(roomTypeQuery, {
    name,
  });
}

export function useSendMessage(
  room: Ref<IRoom>,
  user: Ref<IUser>,
  message: Ref<string>,
) {
  const postMessageTypeMutation = require("~/graphql/mutations/postMessage.graphql");

  return useMutation(postMessageTypeMutation, () => ({
    variables: {
      room: room.value.name,
      user: user.value.id,
      text: message.value,
    },
  }));
}
