import { Module, VuexModule, Mutation } from "vuex-module-decorators";
import { IUser } from "~/types";

@Module({
  name: "Session",
  namespaced: true,
  stateFactory: true,
})
export default class Session extends VuexModule {
  public user: IUser = null;
  public role: string = null;

  @Mutation
  setRole(role: string) {
    this.role = role;
  }

  @Mutation
  login(value: IUser) {
    this.user = value;
  }

  @Mutation
  logout() {
    this.user = null;
    this.role = null;
  }

  @Mutation
  handMoved() {
    this.user.handRaised = !this.user.handRaised;
  }

  @Mutation
  setVote(vote: string) {
    this.user.vote = vote;
  }

  @Mutation
  toggleConferenceJoined() {
    this.user.conferenceJoined = !this.user.conferenceJoined;
  }

  @Mutation
  resetLocalUserParameters() {
    this.user.handRaised = false;
    this.user.conferenceJoined = false;
    this.user.screenShared = false;
  }

  get isModerator() {
    return this.role === "moderator";
  }

  get userRole() {
    if (this.role) {
      return this.role.charAt(0).toUpperCase() + this.role.slice(1);
    }
    return "User";
  }
}
