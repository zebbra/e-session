import { Resolver, Args, Query, Subscription, Mutation } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Inject } from "@nestjs/common";
import { RoomService } from "./room.service";
import { Room, Message } from "./room.model";
import { PUB_SUB } from "../app/pubsub.provider";
import { User } from "../user/user.model";
import { UserService } from "../user/user.service";
import { withCancel } from "../utils/with-observable";

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

  @Query((returns) => [User])
  async usersInConference(@Args("room") room: string) {
    return this.roomService
      .lookup(room)
      .users.filter((user) => user.conferenceJoined);
  }

  @Mutation((returns) => Room)
  async createRoom(@Args("name") name: string) {
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

  @Mutation((returns) => User)
  async join(@Args("userId") userId: string, @Args("roomId") roomId: string) {
    const user = this.roomService.join(userId, roomId);
    this.pubSub.publish("roomJoined", { user, roomId });
    return user;
  }

  @Mutation((returns) => User, { nullable: true })
  async leave(@Args("userId") userId: string, @Args("roomId") roomId: string) {
    const _ = this.userService.resetUserParameters(userId);
    const user = this.roomService.leave(userId, roomId);
    this.pubSub.publish("roomLeft", { user, roomId });
    return user;
  }

  @Mutation((returns) => User)
  async raiseHand(
    @Args("userId") userId: string,
    @Args("roomId") roomId: string,
  ) {
    const user = this.userService.raiseHand(userId);
    this.pubSub.publish("handMoved", { user, roomId });
    console.log("raiseHand user: ", user)
    return user;
  }

  @Mutation((returns) => User)
  async lowerHand(
    @Args("userId") userId: string,
    @Args("roomId") roomId: string,
  ) {
    const user = this.userService.lowerHand(userId);
    this.pubSub.publish("handMoved", { user, roomId });
    return user;
  }

  @Subscription((returns) => User, {
    filter: (payload, variables) => payload.roomId === variables.roomId,
    resolve: (payload) => payload.user,
  })
  handMoved(@Args("roomId") roomId: string) {
    return this.pubSub.asyncIterator("handMoved");
  }

  @Subscription((returns) => User, {
    filter: (payload, variables) => payload.roomId === variables.roomId,
    resolve: (payload) => payload.user,
  })
  roomJoined(@Args("roomId") roomId: string) {
    return this.pubSub.asyncIterator("roomJoined");
  }

  @Subscription((returns) => User, {
    filter: (payload, variables) => payload.roomId === variables.roomId,
    resolve: (payload) => payload.user,
  })
  roomLeft(@Args("roomId") roomId: string) {
    return this.pubSub.asyncIterator("roomLeft");
  }

  @Subscription((returns) => User, {
    filter: (payload, variables) => payload.roomId === variables.roomId,
  })
  signal(@Args("roomId") roomId: string, @Args("userId") userId: string) {
    return withCancel(this.pubSub.asyncIterator("signal"), () => {
      const room = this.roomService.findOne(roomId);
      console.log("signal room: ", room)
      if (room) {
        const user = room.findUser(userId);
        console.log("signal user: ", user)
        if (user) {
          room.userLeft(user.id);
          if (room.users.length === 0) {
            console.log("signal room.users: ", room.users)

            this.roomService.destroy(room.id);
          }
          this.pubSub.publish("roomLeft", { user, roomId });
        }
      }
    });
  }

  @Subscription((returns) => Message, {
    filter: (payload, variables) =>
      payload.message.room.name === variables.room,
    resolve: (payload) => payload.message,
  })
  messagePosted(@Args("room") room: string) {
    return this.pubSub.asyncIterator("messagePosted");
  }

  @Mutation((returns) => User)
  async startShare(
    @Args("userId") userId: string,
    @Args("roomId") roomId: string,
  ) {
    const user = this.userService.startShare(userId);
    this.pubSub.publish("shareToggled", { user, roomId });
    return user;
  }

  @Mutation((returns) => User)
  async endShare(
    @Args("userId") userId: string,
    @Args("roomId") roomId: string,
  ) {
    const user = this.userService.endShare(userId);
    this.pubSub.publish("shareToggled", { user, roomId });
    return user;
  }

  @Subscription((returns) => User, {
    filter: (payload, variables) => payload.roomId === variables.roomId,
    resolve: (payload) => payload.user,
  })
  shareToggled(@Args("roomId") roomId: string) {
    return this.pubSub.asyncIterator("shareToggled");
  }

  @Mutation((returns) => Room)
  async setActiveAgendaItem(
    @Args("roomId") roomId: string,
    @Args("index") index: string,
  ) {

    const room = this.roomService.setActiveAgendaItem(roomId, index);
    console.log("setActiveAgendaItem room", room)
    this.pubSub.publish("agenda", { room });
    return room;
  }

  @Subscription((returns) => Room, {
    filter: (payload, variables) => {
      console.log("payload.room.roomId", payload.room.id)
      console.log("variables.roomId", variables.roomId)
      if (payload.room.id === variables.roomId) {
        return true
      } else {
        return false
      }
    },
    resolve: (payload) => payload.room,
  })
  agenda(@Args("roomId") roomId: string) {
    return this.pubSub.asyncIterator("agenda");
  }

  @Query((returns) => Room)
  async fetchActiveAgendaItem(@Args("roomId") roomId: string) {
    return this.roomService
      .findOne(roomId)
  }

}
