import { Resolver, Args, Query, Subscription, Mutation } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { RoomService } from "./room.service";
import { Room } from "./room.model";
import { User } from "src/user/user.model";

const pubSub = new PubSub();

@Resolver((of) => Room)
export class RoomResolver {
  constructor(private roomService: RoomService) {}

  @Query((returns) => Room, { nullable: true })
  async room(@Args("name") name: string) {
    return this.roomService.lookup(name);
  }

  @Mutation((returns) => Room)
  async say(@Args("room") name: string, @Args("message") message: string) {
    const room = this.roomService.say(name, message);
    pubSub.publish("messagePosted", { room, message });
    return room;
  }

  @Subscription((returns) => User)
  roomCreated() {
    return pubSub.asyncIterator("roomCreated");
  }

  @Subscription((returns) => Room, {
    filter: (payload, variables) => payload.room.name === variables.room,
    resolve: (payload) => payload.room,
  })
  messagePosted(@Args("room") room: string) {
    return pubSub.asyncIterator("messagePosted");
  }
}
