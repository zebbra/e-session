import { Resolver, Args, Query, Subscription, Mutation } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Inject, Injectable } from "@nestjs/common";
import { RoomService } from "./room.service";
import { Room, Message } from "./room.model";
import { User } from "../user/user.model";
import { PUB_SUB } from "../constants";

@Resolver((of) => Room)
export class RoomResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: PubSub,
    private roomService: RoomService,
  ) {}

  @Query((returns) => Room)
  async room(@Args("name") name: string) {
    return this.roomService.lookup(name);
  }

  @Mutation((returns) => Message)
  async say(@Args("room") name: string, @Args("message") text: string) {
    const message = this.roomService.say(name, text);
    this.pubSub.publish("messagePosted", { message });
    return message;
  }

  @Subscription((returns) => User)
  roomCreated() {
    return this.pubSub.asyncIterator("roomCreated");
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
