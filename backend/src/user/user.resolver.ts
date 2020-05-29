import { Resolver, Args, Query, Mutation } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Inject } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.model";
import { PUB_SUB } from "../app/pubsub.provider";

@Resolver((of) => User)
export class UserResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: PubSub,
    private userService: UserService,
  ) {}

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
