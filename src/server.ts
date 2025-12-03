import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { prisma } from "./db/connectPrisma.js";

const typeDefs = `#graphql
  type User {
    id: Int!
    email: String!
    name: String
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
  }

  type Mutation {
    createUser(email: String!, name: String): User!
    updateUser(id: Int!, email: String, name: String): User
    deleteUser(id: Int!): User
  }
`;

const resolvers = {
  Query: {
    users: () => prisma.user.findMany(),
    user: (_: any, args: { id: number }) =>
      prisma.user.findUnique({ where: { id: args.id } }),
  },

  Mutation: {
    createUser: (_: any, args: { email: string; name?: string }) => {
      return prisma.user.create({
        data: {
          email: args.email,
          name: args.name ?? null,
        },
      });
    },

    updateUser: (_: any, args: { id: number; email?: string; name?: string }) => {
      return prisma.user.update({
        where: { id: args.id },
        data: {
          email: args.email ?? "",
          name: args.name ?? "",
        },
      });
    },

    deleteUser: (_: any, args: { id: number }) => {
      return prisma.user.delete({
        where: { id: args.id },
      });
    },
  },
};


async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`Server ready at: ${url}`);
}

startServer();
