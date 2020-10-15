import { Resolver, Args, Query, Mutation, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Inject } from "@nestjs/common";
import { PollService } from "./poll.service";
import { Poll } from "./poll.model";
import { PUB_SUB } from "../app/pubsub.provider";

@Resolver((of) => Poll)
export class PollResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: PubSub,
    private pollService: PollService,
  ) {}
  
  @Query((returns) => Poll, { nullable: true })
  async getPolls() {
    return this.pollService.findAll();
  }

  @Query((returns) => Poll, { nullable: true })
  async getPoll(@Args("id") id: string) {
    return this.pollService.findOne(id);
  }

  @Mutation((returns) => Poll)
  async createPoll(
    @Args("roomId") roomId: string,
  ) {
    const poll = this.pollService.create(roomId);
    this.pubSub.publish("poll", { poll });
    return poll;
  }

  @Mutation((returns) => Poll)
  async endPoll(
    @Args("pollId") pollId: string,
  ) {
    const poll = this.pollService.endPoll(pollId);
    this.pubSub.publish("poll", { poll });
    return poll;
  }

  @Mutation((returns) => Poll)
  async vote(
    @Args("id") id: string,
    @Args("userId") userId: string,
    @Args("vote") vote: string,
  ) {
    let poll: Poll;
    if (vote === "yes") {
      poll = this.pollService.voteYes(id, userId);
    }
    if (vote === "no") {
      poll = this.pollService.voteNo(id, userId);
    }
    if (vote === "abstain") {
      poll = this.pollService.voteAbstain(id, userId);
    }
    this.pubSub.publish("pollUpdate", { poll });
    return poll;
  }

  @Mutation((returns) => Poll)
  async addDidNot(
    @Args("id") id: string,
    @Args("userId") userId: string,
  ) {
    const poll = this.pollService.didNot(id, userId);
    this.pubSub.publish("pollUpdate", { poll });
    return poll;
  }

  @Subscription((returns) => Poll, {
    filter: (payload, variables) => payload.poll.id === variables.pollId,
    resolve: (payload) => payload.poll,
  })
  pollUpdate(@Args("pollId") pollId: string) {
    return this.pubSub.asyncIterator("pollUpdate");
  }

  @Subscription((returns) => Poll, {
    filter: (payload, variables) => payload.poll.roomId === variables.roomId,
    resolve: (payload) => payload.poll,
  })
  poll(
    @Args("roomId") roomId: string) {
    return this.pubSub.asyncIterator("poll");
  }
}