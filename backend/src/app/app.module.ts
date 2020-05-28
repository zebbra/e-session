import { Module, forwardRef } from "@nestjs/common";
import { AppService } from "./app.service";
import { UserModule } from "../user/user.module";
import { RoomModule } from "../room/room.module";
import { PubSubProvider } from "./pubsub.provider";
import { graphQLModule } from "./graphql.module";
import { loggerModule } from "./logger.module";

@Module({
  imports: [
    loggerModule,
    graphQLModule,
    forwardRef(() => UserModule),
    forwardRef(() => RoomModule),
  ],
  controllers: [],
  providers: [AppService, PubSubProvider],
  exports: [PubSubProvider],
})
export class AppModule {}
