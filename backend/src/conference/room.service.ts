import { Injectable } from "@nestjs/common";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";
import { Room } from "./room.model";

@Injectable()
export class RoomService {
  rooms: Room[] = [];

  constructor(
    @InjectPinoLogger(RoomService.name)
    private readonly logger: PinoLogger,
  ) {}

  create(name: string): Room {
    const id = this.rooms.length + 1;
    this.rooms.push(new Room({ id, name }));
    return this.findOne(id);
  }

  findOne(id: number): Room | null {
    this.logger.info("findOne(%d)", id);
    return this.rooms.find((room) => room.id == id);
  }
}
