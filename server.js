import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

// package.json 상 "type": "module" 있으면 위와같이 가능
// const {ApolloServer, gql} = require("apollo-server")

// requirement: typeDefs
// SDL: gql `SDL` : Schema Definition Language
// Query type: Mandatory

let tweets = [
    {
        id: "1",
        text: "first",
        userId: "2"
    },
    {
        id: "2",
        text: "second",
        userId: "1"
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
      userId: String
    }

    type Query {
        allMovies: [Movie!]!
        allUsers: [User!]!
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
        movie(id: String!): Movie
    }
    
    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }

    type Movie {
        id: Int!
        url: String!
        imdb_code: String!
        title: String!
        title_english: String!
        title_long: String!
        slug: String!
        year: Int!
        rating: Float!
        runtime: Float!
        genres: [String]!
        summary: String
        description_full: String!
        synopsis: String
        yt_trailer_code: String!
        language: String!
        background_image: String!
        background_image_original: String!
        small_cover_image: String!
        medium_cover_image: String!
        large_cover_image: String!
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
        },
        allMovies() {
            return fetch("https://yts.mx/api/v2/list_movies.json")
              .then((r) => r.json())
              .then((json) => json.data.movies);
          },
        movie(_, { id }) {
        return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
            .then((r) => r.json())
            .then((json) => json.data.movie);
        },
    },
    Mutation: {
        postTweet(_, {text, userId}) {
            const newTweet = {
                id: tweets.length + 1,
                text,
                userId,
            };

            // tweets.push(newTweet);
            // return newTweet
            if(users.find((user) => user.id === userId)) {
                tweets.push(newTweet);
                return newTweet
            }
            else {
                return;
            }
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
    },
    Tweet: {
        author({userId}) {
            return users.find((user) => user.id === userId);
        }
    }
};

const server = new ApolloServer({typeDefs, resolvers})

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});