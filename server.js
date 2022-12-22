import { ApolloServer, gql } from "apollo-server";

// package.json 상 "type": "module" 있으면 위와같이 가능
// const {ApolloServer, gql} = require("apollo-server")

// requirement: typeDefs
// SDL: gql `SDL` : Schema Definition Language
// Query type: Mandatory

const typeDefs = gql`
  type Query {
    text: String
    hello: String
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});