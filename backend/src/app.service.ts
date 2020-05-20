import { Injectable } from "@nestjs/common";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";
import { delay } from "./utils/helpers";

@Injectable()
export class AppService {
  constructor(
    @InjectPinoLogger(AppService.name)
    private readonly logger: PinoLogger,
  ) {}

  async getHello(params: { test: string }) {
    await delay(500);
    // this.logger.info("getHello(%o)", params);
    return { hello: "world" };
  }
}
