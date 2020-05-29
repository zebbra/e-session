import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import Session from "~/store/Session";
import Global from "~/store/Global";
import ConferenceStatus from "~/store/ConferenceStatus";
import Room from "~/store/Room";

/* eslint-disable import/no-mutable-exports */
let globalStore: Global;
let conferenceStore: ConferenceStatus;
let roomStore: Room;
let sessionStore: Session;
/* eslint-enable import/no-mutable-exports */

function initialiseStores(store: Store<any>): void {
  globalStore = getModule(Global, store);
  conferenceStore = getModule(ConferenceStatus, store);
  roomStore = getModule(Room, store);
  sessionStore = getModule(Session, store);
}

export {
  initialiseStores,
  globalStore,
  roomStore,
  sessionStore,
  conferenceStore,
};
