import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import HelloWorld from "~/store/HelloWorld";

/* eslint-disable import/no-mutable-exports */
let helloWorldStore: HelloWorld;
/* eslint-enable import/no-mutable-exports */

function initialiseStores(store: Store<any>): void {
  helloWorldStore = getModule(HelloWorld, store);
}

export { initialiseStores, helloWorldStore };
