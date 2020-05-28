import { Module, VuexModule, Mutation } from "vuex-module-decorators";
import { IRoom, IUser, IMessage } from "~/types";

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

  @Mutation
  addUser(user: IUser) {
    if (this.room) {
      this.room.users.unshift(user);
    }
  }

  @Mutation
  removeUser(user: IUser) {
    for (let i = this.room.users.length - 1; i >= 0; --i) {
      if (this.room.users[i].id === user.id) {
        this.room.users.splice(i, 1);
      }
    }
  }

  @Mutation
  addMessage(message: IMessage) {
    if (this.room) {
      this.room.messages.push(message);
    }
  }
}
