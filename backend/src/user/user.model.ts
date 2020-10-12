import { Field, ObjectType } from "@nestjs/graphql";
import { v4 as uuidv4 } from "uuid";
import { runInThisContext } from "vm";

@ObjectType()
export class User {
  @Field((type) => String)
  id: string;

  @Field((type) => String)
  name: string;

  @Field((type) => String)
  jid: string;

  @Field((type) => Boolean)
  handRaised: boolean;

  @Field((type) => Boolean)
  conferenceJoined: boolean;

  @Field((type) => Boolean)
  screenShared: boolean;

  @Field((type) => String)
  role: string;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.handRaised = false;
    this.conferenceJoined = false;
    this.screenShared = false;
    this.jid = '';
    this.role = '';
  }

  setJid(jid: string): User {
    this.jid = jid;
    return this;
  }

  raiseHand(): User {
    this.handRaised = true;
    return this;
  }

  lowerHand(): User {
    this.handRaised = false;
    return this;
  }

  startShare(): User {
    this.screenShared = true;
    return this;
  }

  endShare(): User {
    this.screenShared = false;
    return this;
  }

  joinConference(): User {
    this.conferenceJoined = true;
    return this;
  }

  leaveConference(): User {
    this.conferenceJoined = false;
    return this;
  }

  setRole(role: string): User {
    this.role = role;
    return this;
  }

  resetUserParameters(): User {
    this.conferenceJoined = false;
    this.handRaised = false;
    this.conferenceJoined = false;
    this.screenShared = false;
    this.jid = '';
    this.role = '';
    return this;
  }
}
