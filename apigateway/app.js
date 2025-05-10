const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const connectDB = require('./config/db.config');
const { initKafkaProducer, initKafkaConsumer } = require('./services/kafka.service');

// Import GraphQL typeDefs and resolvers
const userTypeDefs = require('./graphql/schemas/user.schema');
const userResolvers = require('./graphql/resolvers/user.resolver');
const movieTypeDefs = require('./graphql/schemas/movie.schema');
const movieResolvers = require('./graphql/resolvers/movie.resolver');
const recommendationTypeDefs = require('./graphql/schemas/recommendation.schema');
const recommendationResolvers = require('./graphql/resolvers/recommendation.resolver');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Combine all GraphQL schemas and resolvers
const typeDefs = [userTypeDefs, movieTypeDefs, recommendationTypeDefs];
const resolvers = [userResolvers, movieResolvers, recommendationResolvers];

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Get the user token from the headers
    const token = req.headers.authorization || '';
    
    // Try to retrieve a user with the token
    // Add the user to the context
    return { token };
  },
});

// Start Apollo Server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // Initialize Kafka
  await initKafkaProducer();
  await initKafkaConsumer();

  console.log(`Apollo Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
}

startServer();

module.exports = app;