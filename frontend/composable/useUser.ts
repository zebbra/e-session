import { useQuery } from "@vue/apollo-composable";

export function fetchUser(id: number) {
  const userTypeQuery = require("~/graphql/user.graphql");

  return useQuery<{ user: { id: number; name: string } }>(userTypeQuery, {
    id,
  });
}
