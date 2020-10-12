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
  public activeAgendaItem: number = 0;

  @Mutation
  setRoom(room: IRoom) {
    this.room = room;
  }

  @Mutation
  clearRoom() {
    this.room = null;
  }

  @Mutation
  setActiveAgendaItem(index: number) {
    this.activeAgendaItem = index;
  }

  @Mutation
  addUser(user: IUser) {
    if (this.room) {
      this.room.users.unshift(user);
      this.room.users
        .sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        )
        .sort((a, b) =>
          a.handRaised === b.handRaised ? 0 : a.handRaised ? -1 : 1,
        );
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
  updateUser(user: IUser) {
    for (let i = this.room.users.length - 1; i >= 0; --i) {
      if (this.room.users[i].id === user.id) {
        this.room.users[i].conferenceJoined = user.conferenceJoined;
        this.room.users[i].handRaised = user.handRaised;
        this.room.users[i].screenShared = user.screenShared;
        this.room.users[i].jid = user.jid;
        this.room.users[i].role = user.role;
        i = 0;
      }
    }

    this.room.users
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
      .sort((a, b) =>
        a.handRaised === b.handRaised ? 0 : a.handRaised ? -1 : 1,
      );
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
