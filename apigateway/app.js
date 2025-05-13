const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initKafkaProducer, initKafkaConsumer } = require('./services/kafkaservice');
const routes = require('./routes');
// Import GraphQL typeDefs and resolvers
const userTypeDefs = require('./graphql/schemas/userSchema.gql');
const userResolvers = require('./graphql/resolvers/userresolver');
const movieTypeDefs = require('./graphql/schemas/movieSchema.gql');
const movieResolvers = require('./graphql/resolvers/movieresolver');



const app = express();
app.use(express.json())
app.use(express.json())
app.use('/', routes); 
// Middleware
app.use(cors());
app.use(express.json());
// Middleware to parse JSO

// Connect to MongoDB
connectDB();

// Combine all GraphQL schemas and resolvers
const typeDefs = [userTypeDefs, movieTypeDefs];
const resolvers = [userResolvers, movieResolvers];

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  userTypeDefs,
  movieTypeDefs
  
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