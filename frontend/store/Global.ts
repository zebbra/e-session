import { Module, VuexModule, Mutation } from "vuex-module-decorators";

@Module({
  name: "Global",
  namespaced: true,
  stateFactory: true,
})
export default class Global extends VuexModule {
  public errorMessage: string = null;

  @Mutation
  showErrorMessage(message: string) {
    this.errorMessage = message;
  }

  @Mutation
  clearErrorMessage() {
    this.errorMessage = null;
  }
}
