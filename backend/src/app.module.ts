import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    // configure HTTP logger
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'debug',
        prettyPrint: {
          translateTime: true,
          messageFormat: '[{context}] - {msg}',
          ignore: 'pid,hostname,context',
        },
      },
    }),

    // configure GraphQL module
    GraphQLModule.forRoot({
      autoSchemaFile: `${process.cwd()}/src/schema.gql`,
      installSubscriptionHandlers: true,
      debug: true,
    }),

    UserModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
