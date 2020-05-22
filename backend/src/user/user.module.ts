import { Module } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { RoomModule } from "../room/room.module";
import { PUB_SUB } from "../constants";

@Module({
  imports: [RoomModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserResolver,
    {
      provide: PUB_SUB,
      useValue: new PubSub(),
    },
  ],
})
export class UserModule {}
