import { Field, ObjectType } from "@nestjs/graphql";
import { v4 as uuidv4 } from "uuid";

@ObjectType()
export class User {
  @Field((type) => String)
  id: string;

  @Field((type) => String)
  name: string;

  @Field((type) => Boolean)
  handRaised: boolean;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.handRaised = false;
  }

  raiseHand(): User {
    this.handRaised = true;
    return this;
  }

  lowerHand(): User {
    this.handRaised = false;
    return this;
  }
}
