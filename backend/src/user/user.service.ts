import { Injectable } from "@nestjs/common";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";
import { User } from "./user.model";

@Injectable()
export class UserService {
  private readonly users: User[] = [];

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
    let user: User;
    for (let i = this.users.length - 1; i >= 0; --i) {
      if (this.users[i].id === id) {
        user = this.users.splice(i, 1)[0];
      }
    }
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    this.logger.info("findOne(%s)", id);
    return this.users.find((user) => user.id === id);
  }

  raiseHand(id: string): User {
    this.logger.info("raiseHand(%s)", id);
    return this.findOne(id).raiseHand();
  }

  lowerHand(id: string): User {
    this.logger.info("lowerHand(%s)", id);
    return this.findOne(id).lowerHand();
  }
}
