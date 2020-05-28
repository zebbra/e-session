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

  findUser(id: string) {
    return this.users.find((user) => user.id === id);
  }

  userJoined(user: User): Room {
    if (!this.users.includes(user)) {
      this.users.push(user);
    }
    return this;
  }

  userLeft(id: string): Room {
    remove(this.users, { id });
    return this;
  }

  say(author: User, text: string): Message {
    const message = new Message(this, author, text);
    this.messages.unshift(message);
    if (this.messages.length > 50) {
      this.messages = this.messages.slice(0, 50);
    }
    return message;
  }
}

@ObjectType()
export class Message {
  @Field((type) => Room)
  room: Room;

  @Field((type) => User)
  author: User;

  @Field()
  text: string;

  constructor(room: Room, author: User, text: string) {
    this.room = room;
    this.author = author;
    this.text = text;
  }
}
