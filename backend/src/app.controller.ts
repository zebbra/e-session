import { Controller, Get, Query } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(
    @InjectPinoLogger(AppService.name) private readonly logger: PinoLogger,
    private readonly appService: AppService,
  ) {}

  @Get("/hello")
  getHello(@Query("text") text = "default") {
    // this.logger.debug("hello", { text });
    return this.appService.getHello({ test: text });
  }
}
