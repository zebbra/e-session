import { Resolver, Args, Query, Subscription, Mutation } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { RoomService } from "./room.service";
import { Room } from "./room.model";
import { User } from "src/user/user.model";

const pubSub = new PubSub();

@Resolver((of) => Room)
export class RoomResolver {
  constructor(private roomService: RoomService) {}

  @Query((returns) => Room)
  async room(@Args("id") id: number) {
    return this.roomService.findOne(id);
  }

  @Mutation((returns) => Room)
  async createRoom(@Args("name") name: string) {
    const room = this.roomService.create(name);
    pubSub.publish("roomCreated", { roomCreated: room });
    return room;
  }

  // @Subscription(returns => User)
  // userJoined() {
  //   return pubSub.asyncIterator('commentAdded');
  // }

  @Subscription((returns) => User)
  roomCreated() {
    return pubSub.asyncIterator("roomCreated");
  }
}
