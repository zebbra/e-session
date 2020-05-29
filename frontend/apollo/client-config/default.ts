import consola from "consola";
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

  consola.error(errorMessage);
  globalStore.showErrorMessage("Server Error");
});

export default function ({ req, nuxtState }) {
  const { env } = req || nuxtState;

  return {
    link: errorLink,
    // required
    httpEndpoint: env.HTTP_GRAPHQL_ENDPOINT || "http://localhost:3001/graphql",
    // optional
    wsEndpoint: env.WS_GRAPHQL_ENDPOINT || "ws://localhost:3001/graphql",
  };
}
