import { Injectable } from "@nestjs/common";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";
import { User } from "../user/user.model";
import { Poll } from "./poll.model";
import { PollModule } from "./poll.module";

@Injectable()
export class PollService {
  private readonly polls: Poll[] = [];

  constructor(
    @InjectPinoLogger(PollService.name)
    private readonly logger: PinoLogger,
  ) {}

  create(roomId: string): Poll {
    this.logger.info("create poll");
    const poll = new Poll();
    poll.roomId = roomId;
    this.polls.push(poll);
    return poll;
  }

  destroy(id: string): Poll {
    this.logger.info("destroy poll(%s)", id);
    let poll: Poll;
    for (let i = this.polls.length - 1; i >= 0; --i) {
      if (this.polls[i].id === id) {
        poll = this.polls.splice(i, 1)[0];
      }
    }
    return poll;
  }

  findAll(): Poll[] {
    return this.polls;
  }

  findOne(id: string): Poll {
    this.logger.debug("findOne poll(%s)", id);
    return this.polls.find((poll) => poll.id === id);
  }

  voteYes(id: string, userId: string): Poll {
    this.logger.info("user (%s) voted yes", userId);
    return this.findOne(id).removeFromOthers(userId).addYes(userId);
  }

  voteNo(id: string, userId: string): Poll {
    this.logger.info("user (%s) voted no", userId);
    return this.findOne(id).removeFromOthers(userId).addNo(userId);
  }

  voteAbstain(id: string, userId: string): Poll {
    this.logger.info("user (%s) did not vote", userId);
    return this.findOne(id).removeFromOthers(userId).addAbstain(userId);
  }

  didNot(id: string, userId: string): Poll {
    this.logger.info("user (%s) did not vote", userId);
    return this.findOne(id).removeFromOthers(userId).addDidNot(userId);
  }

  endPoll(id: string): Poll {
    this.logger.info("ending poll (%s)", id);
    return this.findOne(id).endPoll();
  }
}
