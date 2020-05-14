import { Injectable } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectPinoLogger(UserService.name)
    private readonly logger: PinoLogger,
  ) {}

  findOne(id: number): User {
    this.logger.info('findOne(%d)', id);
    return { id, name: `User ${id}` };
  }
}
