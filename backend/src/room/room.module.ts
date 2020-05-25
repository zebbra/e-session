import { Module, forwardRef } from "@nestjs/common";
import { RoomResolver } from "./room.resolver";
import { RoomService } from "./room.service";
import { UserModule } from "~/user/user.module";
import { AppModule } from "~/app/app.module";

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => AppModule)],
  controllers: [],
  providers: [RoomService, RoomResolver],
  exports: [RoomService],
})
export class RoomModule {}
