import { Field, ObjectType } from "@nestjs/graphql";
import { v4 as uuidv4 } from "uuid";
import { Room } from "../room/room.model";

@ObjectType()
export class User {
  @Field((type) => String)
  id: string;

  @Field((type) => String)
  name: string;

  @Field((type) => Room, { nullable: true })
  room: Room;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }

  joinRoom(room: Room): User {
    this.room = room;
    room.userJoined(this);
    return this;
  }

  leaveRoom(): User {
    if (this.room) {
      this.room.userLeft(this);
      this.room = null;
    }
    return this;
  }
}
