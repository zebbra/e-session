import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import Session from "~/store/Session";
import Global from "~/store/Global";
import Moderation from "~/store/Moderation";

/* eslint-disable import/no-mutable-exports */
let sessionStore: Session;
let globalStore: Global;
let moderationStore: Moderation;
/* eslint-enable import/no-mutable-exports */

function initialiseStores(store: Store<any>): void {
  sessionStore = getModule(Session, store);
  globalStore = getModule(Global, store);
}

export { initialiseStores, sessionStore, globalStore, moderationStore };
