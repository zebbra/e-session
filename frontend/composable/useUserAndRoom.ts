import { useQuery } from "@vue/apollo-composable";

export function fetchUserAndRoom(variables: { id: number; name: string }) {
  const userAndRoomTypeQuery = require("~/graphql/userAndRoom.graphql");

  return useQuery<{
    user?: { id: number; name: string };
    room?: { id: number; name: string; messages: [] };
  }>(userAndRoomTypeQuery, variables);
}
