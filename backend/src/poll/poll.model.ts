import { Field, ObjectType } from "@nestjs/graphql";
import { v4 as uuidv4 } from "uuid";

@ObjectType()
export class Poll {

  @Field((type) => String)
  id: string;

  @Field((type) => String)
  roomId: string;

  @Field((type) => String)
  status: string;

  @Field((type) => [String])
  yes: string[] = [];

  @Field((type) => [String])
  no: string[] = [];

  @Field((type) => [String])
  didNot: string[] = [];

  @Field((type) => [String])
  abstain: string[] = [];
  

  constructor() {
    this.id = uuidv4();
    this.roomId = '';
    this.status = 'started';
    this.yes = [];
    this.no = [];
    this.didNot = [];
    this.abstain = [];
  }

  addYes(userId: string): Poll {
    if (!this.yes.includes(userId)) {
      this.yes.push(userId);
    }
    return this;
  }

  addNo(userId: string): Poll {
    if (!this.no.includes(userId)) {
      this.no.push(userId);
    }
    return this;
  }

  addDidNot(userId: string): Poll {
    if (!this.didNot.includes(userId)) {
      this.didNot.push(userId);
    }
    return this;
  }

  addAbstain(userId: string): Poll {
    if (!this.abstain.includes(userId)) {
      this.abstain.push(userId);
    }
    return this;
  }

  removeYes(userId: string): Poll {
    if (this.yes.includes(userId)) {
      this.yes.splice(this.yes.indexOf(userId), 1);
    }
    return this;
  }

  removeNo(userId: string): Poll {
    if (this.no.includes(userId)) {
      this.no.splice(this.no.indexOf(userId), 1);
    }
    return this;
  }

  removeDidNot(userId: string): Poll {
    if (this.didNot.includes(userId)) {
      this.didNot.splice(this.didNot.indexOf(userId), 1);
    }
    return this;
  }

  removeAbstain(userId: string): Poll {
    if (this.abstain.includes(userId)) {
      this.abstain.splice(this.abstain.indexOf(userId), 1);
    }
    return this;
  }

  removeFromOthers(userId: string) {
    if (this.yes.includes(userId)) {
      this.yes.splice(this.yes.indexOf(userId), 1);
    }
    if (this.no.includes(userId)) {
      this.no.splice(this.no.indexOf(userId), 1);
    }
    if (this.didNot.includes(userId)) {
      this.didNot.splice(this.didNot.indexOf(userId), 1);
    }
    if (this.abstain.includes(userId)) {
      this.abstain.splice(this.abstain.indexOf(userId), 1);
    }
    return this;
  }

  endPoll(): Poll {
    this.status = 'ended'
    return this;
  }
}
