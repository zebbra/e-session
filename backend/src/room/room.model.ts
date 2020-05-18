import { Field, Int, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/user.model";

@ObjectType()
export class Room {
  @Field((type) => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field((type) => [Message])
  messages: Message[] = [];

  constructor(name: string) {
    this.id = 1;
    this.name = name;
  }

  say(message: string): Room {
    this.messages.push(new Message(this, message));
    return this;
  }
}

@ObjectType()
export class Message {
  @Field((type) => Room)
  room: Room;

  @Field()
  text: string;

  constructor(room: Room, text: string) {
    this.room = room;
    this.text = text;
  }
}
