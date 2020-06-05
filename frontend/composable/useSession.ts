import { useMutation } from "@vue/apollo-composable";
import { Ref } from "@vue/composition-api";
import { sessionStore, roomStore } from "~/store";
import { mutations } from "~/apollo";
import { IUser, IRoom } from "~/types";

export function useLogin(userName: Ref<string>) {
  return useMutation(mutations.session.login, () => ({
    variables: {
      name: userName.value,
    },
    update: (_cache, { data }) => {
      sessionStore.login(data.login);
    },
  }));
}

export function useLogout(user: Ref<IUser>) {
  return useMutation(mutations.session.logout, () => ({
    variables: {
      id: user.value.id,
    },
    update: () => {
      sessionStore.logout();
      roomStore.clearRoom();
    },
  }));
}

export function useJoinConference(user: IUser, room: IRoom) {
  return useMutation(mutations.session.joinConference, {
    variables: {
      userId: user.id,
      roomId: room.id,
    },
    update: () => {
      sessionStore.toggleConferenceJoined();
    },
  });
}

export function useLeaveConference(user: IUser, room: IRoom) {
  return useMutation(mutations.session.leaveConference, {
    variables: {
      userId: user.id,
      roomId: room.id,
    },
    update: () => {
      sessionStore.toggleConferenceJoined();
    },
  });
}
