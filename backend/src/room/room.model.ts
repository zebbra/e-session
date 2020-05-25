import { Field, ObjectType } from "@nestjs/graphql";
import { v4 as uuidv4 } from "uuid";
import { remove } from "lodash";
import { User } from "../user/user.model";

@ObjectType()
export class Room {
  @Field((type) => String)
  id: string;

  @Field((type) => String)
  name: string;

  @Field((type) => [Message])
  messages: Message[] = [];

  @Field((type) => [User])
  users: User[] = [];

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }

  userJoined(user: User): Room {
    if (!this.users.includes(user)) {
      this.users.push(user);
    }
    return this;
  }

  userLeft(user: User): Room {
    remove(this.users, { id: user.id });
    return this;
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
