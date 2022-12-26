import { ApolloServer, gql } from "apollo-server";

// package.json 상 "type": "module" 있으면 위와같이 가능
// const {ApolloServer, gql} = require("apollo-server")

// requirement: typeDefs
// SDL: gql `SDL` : Schema Definition Language
// Query type: Mandatory

const tweets = [
    {
        id: "1",
        text: "first",
    },
    {
        id: "2",
        text: "second",
    },
];

const typeDefs = gql`

    type User {
        id: ID!
        username: String!
        firstName: String!
        lastName: String
    }
    type Tweet {
      id: ID!
      text: String!
      author: User
    }

    type Query {
      allTweets: [Tweet!]!
      tweet(id: ID!): Tweet
    }
    
    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`;

/*
    GET /api/v1/tweet
    GET /Api/v1/tweet/:id

    POST DELETE PUT /api/v1/tweets ~~
*/

// const server = new ApolloServer({ typeDefs });

const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        },
        tweet(root, {id}) {
            console.log(id);
            return tweets.find((tweet) => tweet.id === id);
        },
    },
};

const server = new ApolloServer({typeDefs, resolvers})

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});