import { Resolver, Args, Query, Subscription, Mutation } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Inject } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.model";
import { withCancel } from "~/utils/with-observable";
import { PUB_SUB } from "~/app/pubsub.provider";

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
    const { room } = this.userService.findOne(id);
    const user = this.userService.destroy(id);
    if (room) {
      this.pubSub.publish("roomLeft", {
        user,
        roomId: room.id,
      });
    }
    return user;
  }

  @Mutation((returns) => User)
  async join(@Args("userId") userId: string, @Args("roomId") roomId: string) {
    const user = this.userService.join(userId, roomId);
    this.pubSub.publish("roomJoined", { user });
    return user;
  }

  @Mutation((returns) => User)
  async leave(@Args("userId") userId: string, @Args("roomId") roomId: string) {
    const user = this.userService.leave(userId);
    this.pubSub.publish("roomLeft", { user, roomId });
    return user;
  }

  @Subscription((returns) => User, {
    filter: (payload, variables) => payload.user.room.id === variables.roomId,
    resolve: (payload) => payload.user,
  })
  roomJoined(@Args("userId") userId: string, @Args("roomId") roomId: string) {
    return this.pubSub.asyncIterator("roomJoined");
  }

  @Subscription((returns) => User, {
    filter: (payload, variables) => payload.roomId === variables.roomId,
    resolve: (payload) => payload.user,
  })
  roomLeft(@Args("userId") userId: string, @Args("roomId") roomId: string) {
    return this.pubSub.asyncIterator("roomLeft");
  }

  @Subscription((returns) => User)
  signal(@Args("roomId") roomId: string, @Args("userId") userId: string) {
    return withCancel(this.pubSub.asyncIterator("signal"), () => {
      const user = this.userService.findOne(userId);
      if (user && user.room && user.room.id === roomId) {
        this.userService.leave(user.id);
        this.pubSub.publish("roomLeft", { user, roomId });
      }
    });
  }
}
