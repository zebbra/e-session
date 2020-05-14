import { Controller, Get, Param } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { IsNumberString } from 'class-validator';
import { UserService } from './user.service';

class FindOneParams {
  @IsNumberString()
  id: number;
}

@Controller('users')
export class UserController {
  constructor(
    @InjectPinoLogger(UserController.name)
    private readonly logger: PinoLogger,

    private readonly userService: UserService,
  ) {}

  @Get(':id')
  get(@Param() params: FindOneParams) {
    this.logger.info('getting user: %o', params);
    return this.userService.findOne(params.id);
  }
}
