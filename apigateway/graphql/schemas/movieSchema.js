const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    description: String!
    releaseYear: Int!
    director: String!
    genre: String!
    averageRating: Float
    comments: [Comment]
  }

  type Comment {
    id: ID!
    text: String!
    userId: ID!
    movieId: ID!
    sentiment: String
    createdAt: String!
  }

  input MovieInput {
    title: String!
    description: String!
    releaseYear: Int!
    director: String!
    genre: String!
  }

  extend type Query {
    getMovie(id: ID!): Movie
    getAllMovies: [Movie]
    searchMovies(title: String): [Movie]
  }

  extend type Mutation {
    createMovie(input: MovieInput!): Movie
    updateMovie(id: ID!, input: MovieInput!): Movie
    deleteMovie(id: ID!): Boolean
  }
`;

module.exports = typeDefs;