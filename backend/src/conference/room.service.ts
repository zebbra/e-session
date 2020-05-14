import { Injectable } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { Room } from './room.model';

@Injectable()
export class RoomService {
  constructor(
    @InjectPinoLogger(RoomService.name)
    private readonly logger: PinoLogger,
  ) {}

  findOne(id: number): Room {
    this.logger.info('findOne(%d)', id);
    return new Room({ id, name: `Room #{id}` });
  }
}
