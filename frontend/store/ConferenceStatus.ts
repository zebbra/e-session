import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

@Module({
  name: "ConferenceStatus",
  namespaced: true,
  stateFactory: true,
})
export default class ConferenceStatus extends VuexModule {
  public status: { isJoned: Boolean; id: String; displayName: String } = {
    isJoned: false,
    id: "",
    displayName: "",
  };

  public devices: { cameraId: string; micId: string; outputId: string } = {
    cameraId: "",
    micId: "",
    outputId: "",
  };

  // -------DEVICES-------

  @Mutation
  setCamera(id: string) {
    this.devices.cameraId = id;
  }

  @Mutation
  setMic(id: string) {
    this.devices.micId = id;
  }

  @Mutation
  setOutput(id: string) {
    this.devices.outputId = id;
  }

  @Action
  updateCameraId(id: string) {
    this.setCamera(id);
  }

  @Action
  updateMicId(id: string) {
    this.setMic(id);
  }

  @Action
  updateOuputId(id: string) {
    this.setOutput(id);
  }

  // -------STATUS-------

  @Mutation
  setJoned(isJoned: Boolean) {
    this.status.isJoned = isJoned;
  }

  @Mutation
  setId(id: String) {
    this.status.id = id;
  }

  @Mutation
  setDisplayName(displayName: String) {
    this.status.displayName = displayName;
  }

  @Action
  updateJoined(joined: Boolean) {
    this.setJoned(joined);
  }

  @Action
  updateId(text: String) {
    this.setId(text);
  }

  @Action
  updateDisplayName(text: String) {
    this.setDisplayName(text);
  }
}
