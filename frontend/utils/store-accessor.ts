import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import HelloWorld from "~/store/HelloWorld";
import Session from "~/store/Session";
import Global from "~/store/Global";

/* eslint-disable import/no-mutable-exports */
let helloWorldStore: HelloWorld;
let sessionStore: Session;
let globalStore: Global;
/* eslint-enable import/no-mutable-exports */

function initialiseStores(store: Store<any>): void {
  helloWorldStore = getModule(HelloWorld, store);
  sessionStore = getModule(Session, store);
  globalStore = getModule(Global, store);
}

export { initialiseStores, helloWorldStore, sessionStore, globalStore };
