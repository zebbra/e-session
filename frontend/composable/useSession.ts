import { useMutation } from "@vue/apollo-composable";
import { Ref } from "@vue/composition-api";
import { sessionStore, roomStore } from "~/store";
import { mutations } from "~/apollo";
import { IUser } from "~/types";

export function useLogin(userName: Ref<string>, role: string) {
  return useMutation(mutations.session.login, () => ({
    variables: {
      name: userName.value,
      role,
    },
    update: (_cache, { data }) => {
      // console.log("data:data", data);
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

export function useJoinConference() {
  return useMutation(mutations.session.joinConference, {
    update: () => {
      sessionStore.toggleConferenceJoined();
    },
  });
}

export function useLeaveConference() {
  return useMutation(mutations.session.leaveConference, {
    update: () => {
      sessionStore.toggleConferenceJoined();
    },
  });
}
