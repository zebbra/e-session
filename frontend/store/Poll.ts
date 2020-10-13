import { Module, VuexModule, Mutation } from "vuex-module-decorators";
import { roomStore } from "~/store";
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
      this.poll.abstain.map((id) => {
        const data = {
          userId: id,
          vote: "abstain",
        };
        roomStore.setVote(data);
      });
    }

    if (poll.yes) {
      this.poll.yes = poll.yes;
      this.poll.yes.map((id) => {
        const data = {
          userId: id,
          vote: "yes",
        };
        roomStore.setVote(data);
      });
    }
    if (poll.no) {
      this.poll.no = poll.no;
      this.poll.no.map((id) => {
        const data = {
          userId: id,
          vote: "no",
        };
        roomStore.setVote(data);
      });
    }
    if (poll.didNot) {
      this.poll.didNot = poll.didNot;
      this.poll.didNot.map((id) => {
        const data = {
          userId: id,
          vote: "didNot",
        };
        roomStore.setVote(data);
      });
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
}
