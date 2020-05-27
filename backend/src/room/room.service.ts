import { Injectable } from "@nestjs/common";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";
import { Room, Message } from "./room.model";
import { User } from "../user/user.model";

@Injectable()
export class RoomService {
  private readonly rooms: Room[] = [];

  constructor(
    @InjectPinoLogger(RoomService.name)
    private readonly logger: PinoLogger,
  ) {}

  create(name: string): Room {
    this.logger.info("create(%s)", name);
    const room = new Room(name);
    this.rooms.push(room);
    return room;
  }

  destroy(id: string): Room {
    this.logger.info("destroy(%s)", id);

    let room;
    for (let i = this.rooms.length - 1; i >= 0; --i) {
      if (this.rooms[i].id === id) {
        room = this.rooms.splice(i, 1)[0];
      }
    }

    return room;
  }

  findAll(): Room[] {
    return this.rooms;
  }

  findOne(id: string): Room {
    this.logger.info("findOne(%s)", id);
    return this.rooms.find((room) => room.id === id);
  }

  findByName(name: string): Room | null {
    this.logger.info("findByName(%s)", name);
    return this.rooms.find((room) => room.name == name);
  }

  lookup(name: string): Room {
    this.logger.info("lookup(%s)", name);
    return this.findByName(name) || this.create(name);
  }

  say(room: string, author: User, message: string): Message {
    this.logger.info("say(%s)", message);
    return this.lookup(room).say(author, message);
  }
}
