import { Test } from "@nestjs/testing";
import { forwardRef } from "@nestjs/common";
import { RoomService } from "./room.service";
import { UserModule } from "../user/user.module";
import { loggerModule } from "../app/logger.module";

describe("RoomService", () => {
  let roomService: RoomService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [forwardRef(() => UserModule), loggerModule],
      providers: [RoomService],
    }).compile();

    roomService = moduleRef.get<RoomService>(RoomService);
  });

  describe("lookup", () => {
    it("creates a new room", async () => {
      const room = roomService.lookup("test-room");
      expect(roomService.findAll()).toContain(room);
    });
  });
});
