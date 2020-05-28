import { Field, ObjectType } from "@nestjs/graphql";
import { v4 as uuidv4 } from "uuid";

@ObjectType()
export class User {
  @Field((type) => String)
  id: string;

  @Field((type) => String)
  name: string;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }
}
