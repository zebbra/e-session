import { sessionStore, roomStore } from "~/store";

export default function ({ isHMR, route, redirect }) {
  if (isHMR) {
    return;
  }

  const roomJoined = sessionStore.user !== null && roomStore.room !== null;
  if (route.name !== "index" && !roomJoined) {
    const query: any = {};

    if (route.name === "rooms-id") {
      query.room = route.params.id;

      if (route.query.role) {
        query.role = route.query.role;
      }
    }

    return redirect("/", query);
  } else if (route.name === "index" && roomJoined) {
    return redirect(`/rooms/${roomStore.room.name}`);
  }
}
