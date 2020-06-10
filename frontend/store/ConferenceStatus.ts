import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

@Module({
  name: "ConferenceStatus",
  namespaced: true,
  stateFactory: true,
})
export default class ConferenceStatus extends VuexModule {
  public status: {
    isJoined: boolean;
    isSpeaker: boolean;
    id: string;
    displayName: string;
    roomName: string;
    localAudioLevel: number;
    micMuted: boolean;
    camMuted: boolean;
    isSharing: boolean;
  } = {
    isJoined: false,
    isSpeaker: false,
    id: "",
    displayName: "",
    roomName: "",
    localAudioLevel: 0,
    micMuted: false,
    camMuted: false,
    isSharing: false,
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
  setJoined(isJoined: boolean) {
    this.status.isJoined = isJoined;
  }

  @Mutation
  setIsSpeaker(isSpeaker: boolean) {
    this.status.isSpeaker = isSpeaker;
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

  @Mutation
  setLocalAudioLevel(level: number) {
    this.status.localAudioLevel = level;
  }

  @Action
  updateJoined(joined: boolean) {
    this.setJoined(joined);
  }

  @Action
  updateIsSpeaker(isSpeaker: boolean) {
    this.setIsSpeaker(isSpeaker);
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

  @Action
  updateLocalAudioLevel(level: number) {
    this.setLocalAudioLevel(level);
  }

  // ------MIC MUTED---------

  @Mutation
  setMicMuted(status: boolean) {
    this.status.micMuted = status;
  }

  @Action
  updateMicMuted(status: boolean) {
    this.setMicMuted(status);
  }

  // ------CAM MUTED---------

  @Mutation
  setCamMuted(status: boolean) {
    this.status.camMuted = status;
  }

  @Action
  updateCamMuted(status: boolean) {
    this.setCamMuted(status);
  }

  // ------SHARING---------
  @Mutation
  setIsSharing(status: boolean) {
    this.status.isSharing = status;
  }

  @Action
  updateIsSharing(status: boolean) {
    this.setIsSharing(status);
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
