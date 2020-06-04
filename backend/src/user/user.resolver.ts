import { Resolver, Args, Query, Mutation, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Inject } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.model";
import { PUB_SUB } from "../app/pubsub.provider";

@Resolver((of) => User)
export class UserResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: PubSub,
    private userService: UserService,
  ) {}

  @Query((returns) => User, { nullable: true })
  async user(@Args("id") id: string) {
    return this.userService.findOne(id);
  }

  @Mutation((returns) => User)
  async login(@Args("name") name: string) {
    return this.userService.create(name);
  }

  @Mutation((returns) => User)
  async logout(@Args("id") id: string) {
    return this.userService.destroy(id);
  }

  @Mutation((returns) => User)
  async joinConference(
    @Args("userId") userId: string,
    @Args("roomId") roomId: string,
  ) {
    const user = this.userService.joinConference(userId);
    this.pubSub.publish("conferenceJoined", { user, roomId });
    return user;
  }

  @Mutation((returns) => User)
  async leaveConference(
    @Args("userId") userId: string,
    @Args("roomId") roomId: string,
  ) {
    const user = this.userService.leaveConference(userId);
    this.pubSub.publish("conferenceLeft", { user, roomId });
    return user;
  }

  @Subscription((returns) => User, {
    filter: (payload, variables) => payload.roomId === variables.roomId,
    resolve: (payload) => payload.user,
  })
  conferenceJoined(@Args("roomId") roomId: string) {
    return this.pubSub.asyncIterator("conferenceJoined");
  }

  @Subscription((returns) => User, {
    filter: (payload, variables) => payload.roomId === variables.roomId,
    resolve: (payload) => payload.user,
  })
  conferenceLeft(@Args("roomId") roomId: string) {
    return this.pubSub.asyncIterator("conferenceLeft");
  }
}
