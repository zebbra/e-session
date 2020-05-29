import { GraphQLModule } from "@nestjs/graphql";

export const graphQLModule = GraphQLModule.forRoot({
  autoSchemaFile: `${process.cwd()}/src/schema.gql`,
  installSubscriptionHandlers: true,
  debug: true,
  playground: true,
});
