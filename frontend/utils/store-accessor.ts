import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import HelloWorld from "~/store/HelloWorld";
import Session from "~/store/Session";

/* eslint-disable import/no-mutable-exports */
let helloWorldStore: HelloWorld;
let sessionStore: Session;
/* eslint-enable import/no-mutable-exports */

function initialiseStores(store: Store<any>): void {
  helloWorldStore = getModule(HelloWorld, store);
  sessionStore = getModule(Session, store);
}

export { initialiseStores, helloWorldStore, sessionStore };
