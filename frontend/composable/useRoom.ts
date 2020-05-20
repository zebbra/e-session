import { useQuery } from "@vue/apollo-composable";
import { IRoom } from "~/types";

export function fetchRoom(name: string) {
  const roomTypeQuery = require("~/graphql/room.graphql");

  return useQuery<{
    room: IRoom;
  }>(roomTypeQuery, {
    name,
  });
}
