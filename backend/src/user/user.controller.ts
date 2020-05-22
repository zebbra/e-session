import { Controller, Get, Param } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { UserService } from "./user.service";

class FindOneParams {
  id: string;
}

@Controller("users")
export class UserController {
  constructor(
    @InjectPinoLogger(UserController.name)
    private readonly logger: PinoLogger,
    private readonly userService: UserService,
  ) {}

  @Get(":id")
  get(@Param() params: FindOneParams) {
    this.logger.info("getting user: %o", params);
    return this.userService.findOne(params.id);
  }
}
