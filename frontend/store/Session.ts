import { Module, VuexModule, Mutation } from "vuex-module-decorators";
import { IUser, IRoom } from "~/types";

@Module({
  name: "Session",
  namespaced: true,
  stateFactory: true,
})
export default class Session extends VuexModule {
  public user: IUser = null;

  @Mutation
  login(value: IUser) {
    this.user = value;
  }

  @Mutation
  logout() {
    this.user = null;
  }

  @Mutation
  joinRoom(room: IRoom) {
    this.user.room = room;
  }

  @Mutation
  leaveRoom() {
    this.user.room = null;
  }
}
