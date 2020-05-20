import { useQuery } from "@vue/apollo-composable";

export function fetchRoom(name: string) {
  const roomTypeQuery = require("~/graphql/room.graphql");

  return useQuery<{
    room: { id: number; name: string; messages: { text: string }[] };
  }>(roomTypeQuery, {
    name,
  });
}
