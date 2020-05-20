import { Injectable } from "@nestjs/common";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";
import { Room, Message } from "./room.model";

@Injectable()
export class RoomService {
  rooms: Room[] = [];

  constructor(
    @InjectPinoLogger(RoomService.name)
    private readonly logger: PinoLogger,
  ) {}

  lookup(name: string): Room {
    return this.findByName(name) || this.create(name);
  }

  create(name: string): Room {
    this.rooms.push(new Room(name));
    return this.findByName(name);
  }

  findByName(name: string): Room | null {
    this.logger.info("findByName(%s)", name);
    return this.rooms.find((room) => room.name == name);
  }

  say(room: string, message: string): Message {
    this.logger.info("say(%s)", message);
    return this.lookup(room).say(message);
  }
}
