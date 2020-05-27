import { Module, VuexModule, Mutation } from "vuex-module-decorators";
import { IUser, IRoom } from "~/types";

@Module({
  name: "Moderation",
  namespaced: true,
  stateFactory: true,
})
export default class Moderation extends VuexModule {
  public users: IUser[] = [];
  public room: IRoom = null;

  @Mutation
  setRoom(room: IRoom) {
    this.room = room;
  }

  @Mutation
  leaveRoom(){
    this.room = null
  }
}
