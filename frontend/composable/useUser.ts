import { useQuery, useMutation } from "@vue/apollo-composable";
import { Ref } from "nuxt-composition-api";
import { sessionStore } from "~/store";
import { IUser, IRoom } from "~/types";

export function fetchUser(id: number) {
  const userTypeQuery = require("~/graphql/user.graphql");

  return useQuery<{ user: IUser }>(userTypeQuery, {
    id,
  });
}

export function login(variables) {
  const loginTypeMutation = require("~/graphql/mutations/login.graphql");

  return useMutation(loginTypeMutation, () => ({
    variables,
    update: (_cache, { data }) => {
      variables.name = "";
      sessionStore.login(data.login);
    },
  }));
}

export function logout(user: Ref<IUser>) {
  const logoutTypeMutation = require("~/graphql/mutations/logout.graphql");
  return useMutation(logoutTypeMutation, () => ({
    variables: {
      id: user.value.id,
    },
    update: () => {
      sessionStore.logout();
    },
  }));
}

export function join(user: Ref<IUser>, room: Ref<IRoom>) {
  const joinRoomTypeMutation = require("~/graphql/mutations/joinRoom.graphql");
  return useMutation(joinRoomTypeMutation, () => ({
    variables: {
      userId: user.value.id,
      roomId: room.value.id,
    },
    update: (_cache, { data }) => {
      sessionStore.joinRoom(data.join.room);
    },
  }));
}

export function leave(user: Ref<IUser>, room: Ref<IRoom>) {
  const leaveRoomTypeMutation = require("~/graphql/mutations/leaveRoom.graphql");
  return useMutation(leaveRoomTypeMutation, () => ({
    variables: {
      userId: user.value.id,
      roomId: room.value.id,
    },
    update: () => {
      sessionStore.leaveRoom();
    },
  }));
}
