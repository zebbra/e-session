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
}
