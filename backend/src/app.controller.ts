import { Controller, Get } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    @InjectPinoLogger(AppService.name) private readonly logger: PinoLogger,
    private readonly appService: AppService,
  ) {}

  @Get('/hello')
  getHello() {
    this.logger.debug('hello', { world: 1 });
    return this.appService.getHello({ test: 1 });
  }
}
