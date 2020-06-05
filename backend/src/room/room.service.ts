import { Injectable } from "@nestjs/common";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";
import { Room, Message } from "./room.model";
import { User } from "../user/user.model";
import { UserService } from "../user/user.service";

@Injectable()
export class RoomService {
  private readonly rooms: Room[] = [];

  constructor(
    @InjectPinoLogger(RoomService.name)
    private readonly logger: PinoLogger,
    private userService: UserService,
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
    this.logger.debug("findOne(%s)", id);
    return this.rooms.find((room) => room.id === id);
  }

  findByName(name: string): Room | null {
    this.logger.debug("findByName(%s)", name);
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

  join(userId: string, roomId: string): User {
    this.logger.info("join(%s %s)", userId, roomId);
    const user = this.userService.findOne(userId);
    if (user) {
      const room = this.findOne(roomId);
      if (room) {
        room.userJoined(user);
      }
    }
    return user;
  }

  leave(userId: string, roomId: string): User {
    this.logger.info("leave(%s %s)", userId, roomId);
    const user = this.userService.findOne(userId);
    const room = this.findOne(roomId);
    if (room) {
      room.userLeft(userId);
      if (room.users.length === 0) {
        this.destroy(room.id);
      }
    }
    return user;
  }
}
