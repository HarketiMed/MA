require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const commentsRouter = require('./routes/comments.routes');
const { startAnalysisResultConsumer } = require('./services/sentiment.consumer');

const app = express();

// Middleware
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/comments', commentsRouter);

// Start Kafka Consumer
startAnalysisResultConsumer().catch(console.error);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;