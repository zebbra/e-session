import { Module, VuexModule } from "vuex-module-decorators";
import { IUser, IRoom } from "~/types";

@Module({
  name: "Moderation",
  namespaced: true,
  stateFactory: true,
})
export default class Moderation extends VuexModule {
  public users: IUser[] = [];
  public room: IRoom = null;
}
