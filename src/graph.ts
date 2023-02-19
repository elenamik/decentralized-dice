import { ApolloClient, InMemoryCache } from "@apollo/client";

export const GRAPH_URL = process.env.NEXT_PUBLIC_GRAPH_URL;

if (!GRAPH_URL) throw new Error("Please specify NEXT_PUBLIC_GRAPH_URL");

export const graphQLClient = new ApolloClient({
  uri: GRAPH_URL,
  cache: new InMemoryCache(),
});
