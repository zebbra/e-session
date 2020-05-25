import { Module, forwardRef } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { RoomResolver } from "./room.resolver";
import { RoomService } from "./room.service";
import { UserModule } from "../user/user.module";
import { PUB_SUB } from "../constants";

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [],
  providers: [
    RoomService,
    RoomResolver,
    {
      provide: PUB_SUB,
      useValue: new PubSub(),
    },
  ],
  exports: [RoomService],
})
export class RoomModule {}
