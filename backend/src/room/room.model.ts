import { Field, Int, ObjectType } from "@nestjs/graphql";
import { v4 as uuidv4 } from "uuid";
import { User } from "src/user/user.model";

@ObjectType()
export class Room {
  @Field((type) => String)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field((type) => [Message])
  messages: Message[] = [];

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }

  say(text: string): Message {
    const message = new Message(this, text);
    this.messages.push(message);
    return message;
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
