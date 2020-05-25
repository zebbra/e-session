import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import Session from "~/store/Session";
import Global from "~/store/Global";

/* eslint-disable import/no-mutable-exports */
let sessionStore: Session;
let globalStore: Global;
/* eslint-enable import/no-mutable-exports */

function initialiseStores(store: Store<any>): void {
  sessionStore = getModule(Session, store);
  globalStore = getModule(Global, store);
}

export { initialiseStores, sessionStore, globalStore };
