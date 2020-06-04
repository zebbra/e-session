import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

@Module({
  name: "ConferenceStatus",
  namespaced: true,
  stateFactory: true,
})
export default class ConferenceStatus extends VuexModule {
  public status: {
    isJoned: boolean;
    id: string;
    displayName: string;
    roomName: string;
  } = {
    isJoned: false,
    id: "",
    displayName: "",
    roomName: "",
  };

  public devices: { cameraId: string; micId: string; outputId: string } = {
    cameraId: "",
    micId: "",
    outputId: "",
  };

  public devicePremissionPromptShown: string = "";
  public deviceSettingsVisible: boolean = false;
  public setupVisible: boolean = false;

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
  setJoned(isJoned: boolean) {
    this.status.isJoned = isJoned;
  }

  @Mutation
  setId(id: string) {
    this.status.id = id;
  }

  @Mutation
  setDisplayName(displayName: string) {
    this.status.displayName = displayName;
  }

  @Mutation
  setRoomName(roomName: string) {
    this.status.roomName = roomName;
  }

  @Action
  updateJoined(joined: boolean) {
    this.setJoned(joined);
  }

  @Action
  updateId(text: string) {
    this.setId(text);
  }

  @Action
  updateDisplayName(text: string) {
    this.setDisplayName(text);
  }

  @Action
  updateRoomName(roomName: string) {
    this.setRoomName(roomName);
  }

  // ------SETUP/SETTINGS---------

  @Mutation
  setDeviceSettingsVisible(state: boolean) {
    this.deviceSettingsVisible = state;
  }

  @Mutation
  setSetupVisible(state: boolean) {
    this.setupVisible = state;
  }

  @Action
  showDeviceSettings(state: boolean) {
    this.setDeviceSettingsVisible(state);
  }

  @Action
  showSetup(state: boolean) {
    this.setSetupVisible(state);
  }

  @Mutation
  setDevicePremissionPromptShown(type: string) {
    this.devicePremissionPromptShown = type;
  }

  @Action
  premissionPromptShown(type: string) {
    this.setDevicePremissionPromptShown(type);
  }
}
