import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { RoomModule } from "../room/room.module";
import { AppModule } from "../app/app.module";

@Module({
  imports: [forwardRef(() => RoomModule), forwardRef(() => AppModule)],
  controllers: [],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
