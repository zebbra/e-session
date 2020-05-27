import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

@Module({
  name: "Global",
  namespaced: true,
  stateFactory: true,
})
export default class Global extends VuexModule {
  public errorMessage: string = null;
  public deviceSettingsVisible: boolean = false;

  @Mutation
  setDeviceSettingsVisible(state: boolean) {
    this.deviceSettingsVisible = state;
  }

  @Action
  showDeviceSettings(state: boolean) {
    this.setDeviceSettingsVisible(state);
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
