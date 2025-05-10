const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Recommendation {
    id: ID!
    userId: ID!
    movieId: ID!
    score: Float!
    reason: String
    createdAt: String!
  }

  extend type Query {
    getUserRecommendations(userId: ID!): [Recommendation]
    getMovieRecommendations(movieId: ID!): [Recommendation]
  }

  extend type Mutation {
    generateRecommendations(userId: ID!): [Recommendation]
  }
`;

module.exports = typeDefs;