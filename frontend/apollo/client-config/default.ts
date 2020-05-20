import { ErrorLink } from "apollo-link-error";
import { globalStore } from "~/store";

const errorLink = new ErrorLink((error) => {
  const { graphQLErrors, networkError } = error;

  const errorMessage = networkError
    ? `Network Error: ${networkError}`
    : `GraphQL Errors: ${graphQLErrors.reduce(
        (accumulator, current) =>
          accumulator.concat(
            `${accumulator === "" ? "" : "; "} ${current.message}`,
          ),
        "",
      )}`;

  globalStore.showErrorMessage(errorMessage);
});

export default function () {
  return {
    link: errorLink,
    // required
    httpEndpoint:
      process.env.HTTP_GRAPHQL_ENDPOINT || "http://localhost:3001/graphql",
    // optional
    wsEndpoint:
      process.env.WS_GRAPHQL_ENDPOINT || "ws://localhost:3001/graphql",
  };
}
