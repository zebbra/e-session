import { Injectable } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@Injectable()
export class AppService {
  constructor(
    @InjectPinoLogger(AppService.name)
    private readonly logger: PinoLogger,
  ) {}

  getHello(...params: any[]) {
    this.logger.info('getHello(%o)', params);
    return { hello: 'world' };
  }
}
