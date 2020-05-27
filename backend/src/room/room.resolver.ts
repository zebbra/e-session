import { Resolver, Args, Query, Subscription, Mutation } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Inject } from "@nestjs/common";
import { RoomService } from "./room.service";
import { Room, Message } from "./room.model";
import { PUB_SUB } from "../app/pubsub.provider";
import { UserService } from "../user/user.service";

@Resolver((of) => Room)
export class RoomResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: PubSub,
    private roomService: RoomService,
    private userService: UserService,
  ) {}

  @Query((returns) => Room)
  async room(@Args("name") name: string) {
    return this.roomService.lookup(name);
  }

  @Mutation((returns) => Message)
  async say(
    @Args("room") name: string,
    @Args("author") author: string,
    @Args("text") text: string,
  ) {
    const user = this.userService.findOne(author);
    const message = this.roomService.say(name, user, text);
    this.pubSub.publish("messagePosted", { message });
    return message;
  }

  @Subscription((returns) => Message, {
    filter: (payload, variables) =>
      payload.message.room.name === variables.room,
    resolve: (payload) => payload.message,
  })
  messagePosted(@Args("room") room: string) {
    return this.pubSub.asyncIterator("messagePosted");
  }
}
