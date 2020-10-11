import { Module, VuexModule, Mutation } from "vuex-module-decorators";
import { IPoll } from "~/types";

@Module({
  name: "Poll",
  namespaced: true,
  stateFactory: true,
})
export default class Poll extends VuexModule {
  public poll: IPoll = null;

  @Mutation
  setPoll(poll: IPoll) {
    this.poll = poll;
  }

  @Mutation
  updatePoll(poll: IPoll) {
    if (poll.abstain) {
      this.poll.abstain = poll.abstain;
    }
    if (poll.yes) {
      this.poll.yes = poll.yes;
    }
    if (poll.no) {
      this.poll.no = poll.no;
    }
    if (poll.didNot) {
      this.poll.didNot = poll.didNot;
    }
  }

  @Mutation
  resetPoll() {
    this.poll.yes = [];
    this.poll.no = [];
    this.poll.abstain = [];
    this.poll.didNot = [];
    this.poll.status = "";
    this.poll.id = "";
    this.poll.roomId = "";
  }

  // get isRunning() {
    // return this.poll.status === "started";
  // }
}
