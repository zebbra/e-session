import { Module } from '@nestjs/common';
import { RoomResolver } from './room.resolver';
import { RoomService } from './room.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RoomService, RoomResolver],
})
export class RoomModule {}
