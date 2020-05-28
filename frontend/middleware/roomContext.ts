import { Context } from "@nuxt/types";
import { sessionStore, roomStore } from "~/store";

export default function (context: Context) {
  if (context.isHMR) {
    return;
  }

  const roomJoined = sessionStore.user !== null && roomStore.room !== null;
  if (context.route.name !== "index" && !roomJoined) {
    return context.redirect("/");
  } else if (context.route.name === "index" && roomJoined) {
    return context.redirect(`/rooms/${roomStore.room.name}`);
  }
}
