import { Resolver, Args, Query, Mutation } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { User } from "./user.model";

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query((returns) => User, { nullable: true })
  async user(@Args("id") id: string) {
    return this.userService.findOne(id);
  }

  @Mutation((returns) => User)
  async login(@Args("name") name: string) {
    return this.userService.create(name);
  }

  @Mutation((returns) => User)
  async logout(@Args("id") id: string) {
    return this.userService.destroy(id);
  }
}
