import { Module, VuexModule, Mutation } from "vuex-module-decorators";
import { IRoom } from "~/types";

@Module({
  name: "Room",
  namespaced: true,
  stateFactory: true,
})
export default class Room extends VuexModule {
  public room: IRoom = null;

  @Mutation
  setRoom(room: IRoom) {
    this.room = room;
  }

  @Mutation
  clearRoom() {
    this.room = null;
  }
}
