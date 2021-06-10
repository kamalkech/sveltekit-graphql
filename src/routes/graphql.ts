import type { EndpointOutput, RequestHandler } from "@sveltejs/kit";
import { ApolloServer, gql } from "apollo-server-lambda";

type User = {
  value: string,
  title: string,
}

const typeDefs = gql`
  type User {
    value: String,
    title: String,
  }
  type Query {
    hello: String
    getItems: [User]
  }
  type Mutation {
    double(x: Int!): Int!
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
    getItems: async (): Promise<User[]> => {
      const res = await fetch('https://jsonplaceholder.cypress.io/users?_limit=10');
      const data = await res.json();
      return data.map((item) => ({ value: item.id, title: item.name }));
    }
  },
  Mutation: {
    double: (_, { x }) => x * 2,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  tracing: true,
});

const graphqlHandler = apolloServer.createHandler();

const handler: RequestHandler = async (args) => {
  return await new Promise<EndpointOutput>((resolve, reject) => {
    graphqlHandler(
      {
        httpMethod: args.method,
        headers: args.headers,
        path: args.path,
        body: args.rawBody as string,
      } as any,
      {} as any,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            status: result.statusCode,
            body: result.body,
            headers: result.headers as any,
          });
        }
      }
    ) as any;
  });
};

export const head = handler;
export const get = handler;
export const post = handler;
