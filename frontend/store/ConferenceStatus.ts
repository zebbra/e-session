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
