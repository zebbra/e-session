import { useQuery } from "@vue/apollo-composable";
import { IUser, IRoom } from "~/types";

export function fetchUserAndRoom(variables: { id: string; name: string }) {
  const userAndRoomTypeQuery = require("~/graphql/userAndRoom.graphql");

  return useQuery<{
    user?: IUser;
    room?: IRoom;
  }>(userAndRoomTypeQuery, variables);
}
