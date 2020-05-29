import { Module, VuexModule, Mutation } from "vuex-module-decorators";
import { IRoom, IUser, IMessage } from "~/types";

@Module({
  name: "Room",
  namespaced: true,
  stateFactory: true,
})
export default class Room extends VuexModule {
  public room: IRoom = null;
  public usersFilter: string = null;

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
      this.room.users = this.room.users.sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
    }
  }

  @Mutation
  removeUser(user: IUser) {
    for (let i = this.room.users.length - 1; i >= 0; --i) {
      if (this.room.users[i].id === user.id) {
        this.room.users.splice(i, 1);
        i = 0;
      }
    }
  }

  @Mutation
  addMessage(message: IMessage) {
    if (this.room) {
      this.room.messages.unshift(message);

      if (this.room.messages.length > 50) {
        this.room.messages = this.room.messages.slice(0, 50);
      }
    }
  }

  @Mutation
  handMoved(user: IUser) {
    for (let i = this.room.users.length - 1; i >= 0; --i) {
      if (this.room.users[i].id === user.id) {
        this.room.users[i].handRaised = user.handRaised;
        i = 0;
      }
    }
  }

  @Mutation
  setUsersFilter(filter: string) {
    this.usersFilter = filter;
  }

  get processedUsers() {
    if (this.usersFilter) {
      return (this.room ? this.room.users : []).filter((user) =>
        new RegExp(this.usersFilter, "i").test(user.name),
      );
    }
    return this.room ? this.room.users : [];
  }
}
