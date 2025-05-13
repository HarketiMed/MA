const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String},
  description: String,
  releaseYear: Number,
  director: String,
  genre: String,
  duration: Number
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);