import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import HelloWorld from "~/store/HelloWorld";
import ConferenceStatus from "~/store/ConferenceStatus";

/* eslint-disable import/no-mutable-exports */
let helloWorldStore: HelloWorld;
let conferenceStatusStore: ConferenceStatus;
/* eslint-enable import/no-mutable-exports */

function initialiseStores(store: Store<any>): void {
  helloWorldStore = getModule(HelloWorld, store);
  conferenceStatusStore = getModule(ConferenceStatus, store);
}

export { initialiseStores, helloWorldStore, conferenceStatusStore };
