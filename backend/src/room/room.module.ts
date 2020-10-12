import { Module, forwardRef } from "@nestjs/common";
import { RoomResolver } from "./room.resolver";
import { RoomService } from "./room.service";
import { UserModule } from "../user/user.module";
import { AppModule } from "../app/app.module";
import { PollModule } from "../poll/poll.module";

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => AppModule), forwardRef(() => PollModule)],
  controllers: [],
  providers: [RoomService, RoomResolver],
  exports: [RoomService],
})
export class RoomModule {}
