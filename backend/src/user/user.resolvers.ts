import { Resolver, Args, Query } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { User } from "./user.model";

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query((returns) => User)
  async user(@Args("id") id: number) {
    return this.userService.findOne(id);
  }
}
