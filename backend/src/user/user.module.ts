import { Module, forwardRef } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { RoomModule } from "../room/room.module";
import { PUB_SUB } from "../constants";

@Module({
  imports: [forwardRef(() => RoomModule)],
  controllers: [UserController],
  providers: [
    UserService,
    UserResolver,
    {
      provide: PUB_SUB,
      useValue: new PubSub(),
    },
  ],
  exports: [UserService],
})
export class UserModule {}
