import type { EndpointOutput, RequestHandler } from "@sveltejs/kit";
import { ApolloServer, gql } from "apollo-server-lambda";

import { typeDefsUser, resolverUser } from '$lib/services/user.service'

const typeDefs = gql`
  type Query
  type Mutation
`;

const typeDefsA = gql`
  extend type Query {
    hello: String
  }
  input CalculateInput {
    x: Int!
    y: Int!
  }
  extend type Mutation {
    double(input: CalculateInput): Int!
  }
`;

const typeDefsB = gql`
  extend type Query {
    islam: String
  }
`;

// Provide resolver functions for your schema fields
const resolversA = {
  Query: {
    hello: () => "Hello world!",
    islam: () => "salam alikom"
  },
  Mutation: {
    double: (_: any, args: any) => {
      const { input } = args;
      return input.x * input.y
    },
  },
};


const apolloServer = new ApolloServer({
  typeDefs: [typeDefs, typeDefsA, typeDefsB, typeDefsUser],
  resolvers: [resolversA, resolverUser],
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
