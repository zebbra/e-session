import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import Session from "~/store/Session";
import Global from "~/store/Global";
import ConferenceStatus from "~/store/ConferenceStatus";

/* eslint-disable import/no-mutable-exports */
let sessionStore: Session;
let globalStore: Global;
let conferenceStatusStore: ConferenceStatus;
/* eslint-enable import/no-mutable-exports */

function initialiseStores(store: Store<any>): void {
  sessionStore = getModule(Session, store);
  globalStore = getModule(Global, store);
  conferenceStatusStore = getModule(ConferenceStatus, store);
}

export { initialiseStores, sessionStore, globalStore, conferenceStatusStore };
