import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Room {
  @Field(type => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  constructor(props: object) {
    Object.assign(this, props);
  }
}
