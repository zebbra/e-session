import { Resolver, Args, Query, Subscription, Mutation } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { RoomService } from "./room.service";
import { Room, Message } from "./room.model";
import { User } from "src/user/user.model";

const pubSub = new PubSub();

@Resolver((of) => Room)
export class RoomResolver {
  constructor(private roomService: RoomService) {}

  @Query((returns) => Room)
  async room(@Args("name") name: string) {
    return this.roomService.lookup(name);
  }

  @Mutation((returns) => Message)
  async say(@Args("room") name: string, @Args("message") text: string) {
    const message = this.roomService.say(name, text);
    pubSub.publish("messagePosted", { message });
    return message;
  }

  @Subscription((returns) => User)
  roomCreated() {
    return pubSub.asyncIterator("roomCreated");
  }

  @Subscription((returns) => Message, {
    filter: (payload, variables) =>
      payload.message.room.name === variables.room,
    resolve: (payload) => payload.message,
  })
  messagePosted(@Args("room") room: string) {
    return pubSub.asyncIterator("messagePosted");
  }
}
