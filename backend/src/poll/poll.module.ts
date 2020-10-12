import { Module, forwardRef } from "@nestjs/common";
import { RoomModule } from "../room/room.module";
import { UserModule } from "../user/user.module";
import { AppModule } from "../app/app.module";
import { PollResolver } from "./poll.resolver";
import { PollService } from "./poll.service";

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => AppModule), forwardRef(() => RoomModule)],
  controllers: [],
  providers: [PollService, PollResolver],
  exports: [PollService],
})
export class PollModule {}
