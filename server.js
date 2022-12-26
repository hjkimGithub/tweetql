import { ApolloServer, gql } from "apollo-server";

// package.json 상 "type": "module" 있으면 위와같이 가능
// const {ApolloServer, gql} = require("apollo-server")

// requirement: typeDefs
// SDL: gql `SDL` : Schema Definition Language
// Query type: Mandatory

let tweets = [
    {
        id: "1",
        text: "first",
    },
    {
        id: "2",
        text: "second",
    },
];

let users = [
    {
        id: "1",
        firstName: "nico",
        lastName: "las",
    },
    {
        id: "2",
        firstName: "Elon",
        lastName: "Musk",
    },
];

const typeDefs = gql`

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        fullName: String!
    }
    type Tweet {
      id: ID!
      text: String!
      author: User
    }

    type Query {
      allUsers: [User!]!
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
            // console.log(id);
            return tweets.find((tweet) => tweet.id === id);
        },
        allUsers() {
            // console.log("allusers called");
            return users;
        }
    },
    Mutation: {
        postTweet(_, {text, userId}) {
            const newTweet = {
                id: tweets.length + 1,
                text,
            };
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(_, {id}) {
            const tweet = tweets.find(tweet => tweet.id === id);
            if(!tweet)  return false;
            tweets = tweets.filter(tweet => tweet.id !== id);
            return true;
        }
    },
    User: {
        fullName({firstName, lastName}) {
            // console.log("fullName called");
            // console.log(root);
            return `${firstName} ${lastName}`;
        }
    }
};

const server = new ApolloServer({typeDefs, resolvers})

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});