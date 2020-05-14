import { Resolver, Args, Query } from '@nestjs/graphql';
import { RoomService } from './room.service';
import { Room } from './room.model';

@Resolver(of => Room)
export class RoomResolver {
  constructor(private roomService: RoomService) {}

  @Query(returns => Room)
  async room(@Args('id') id: number) {
    return this.roomService.findOne(id);
  }
}
