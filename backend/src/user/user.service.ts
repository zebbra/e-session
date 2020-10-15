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

  create(name: string, role: string): User {
    this.logger.info("create (%s) with role (%s)", name, role);
    const user = new User(name);
    user.role = role
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
    this.logger.debug("findOne(%s)", id);
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

  startShare(id: string): User {
    this.logger.info("startShare(%s)", id);
    return this.findOne(id).startShare();
  }

  endShare(id: string): User {
    this.logger.info("endShare(%s)", id);
    return this.findOne(id).endShare();
  }

  joinConference(id: string): User {
    this.logger.info("joinConference(%s)", id);
    return this.findOne(id).joinConference();
  }

  leaveConference(id: string): User {
    this.logger.info("leaveConference(%s)", id);
    return this.findOne(id).leaveConference();
  }

  setJid(id: string, jid: string): User {
    this.logger.info("set Jitsi ID (%s) for user (%s)", jid, id);
    return this.findOne(id).setJid(jid);
  }

  resetUserParameters(id: string): User {
    this.logger.info("resetUserParameters for user (%s)", id);
    return this.findOne(id).resetUserParameters();
  }

  setRole(id: string, role: string): User {
    this.logger.info("setRole for (%s) to (%s)", id, role);
    return this.findOne(id).setRole(role);
  }

}
