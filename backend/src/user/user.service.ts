import { Injectable } from "@nestjs/common";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";
import { User } from "./user.model";

@Injectable()
export class UserService {
  users: User[] = [];

  constructor(
    @InjectPinoLogger(UserService.name)
    private readonly logger: PinoLogger,
  ) {}

  create(name: string): User {
    this.logger.info("create(%s)", name);
    const user = new User(name);
    this.users.push(user);
    return user;
  }

  destroy(id: string): User {
    this.logger.info("destroy(%s)", id);

    let user;
    for (let i = this.users.length - 1; i >= 0; --i) {
      if (this.users[i].id === id) {
        user = this.users.splice(i, 1)[0];
      }
    }

    return user;
  }

  findOne(id: string): User {
    this.logger.info("findOne(%d)", id);
    return this.users.find((user) => user.id === id);
  }
}
