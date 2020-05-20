import { Module } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { RoomResolver } from "./room.resolver";
import { RoomService } from "./room.service";
import { PUB_SUB } from "../constants";

@Module({
  imports: [],
  controllers: [],
  providers: [
    RoomService,
    RoomResolver,
    {
      provide: PUB_SUB,
      useValue: new PubSub(),
    },
  ],
})
export class RoomModule {}
