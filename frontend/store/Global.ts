import { Module, VuexModule, Mutation } from "vuex-module-decorators";

@Module({
  name: "Global",
  namespaced: true,
  stateFactory: true,
})
export default class Global extends VuexModule {
  public errorMessage: string = null;
  public moderationDrawer: boolean = true;

  @Mutation
  toggleModerationDrawer() {
    this.moderationDrawer = !this.moderationDrawer;
  }

  @Mutation
  closeModerationDrawer() {
    this.moderationDrawer = false;
  }

  @Mutation
  showErrorMessage(message: string) {
    this.errorMessage = message;
  }

  @Mutation
  clearErrorMessage() {
    this.errorMessage = null;
  }
}
