const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  releaseYear: {
    type: Number,
    required: true,
    min: 1888 // First movie ever made
  },
  director: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true,
    enum: [
      'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
      'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
      'Romance', 'Sci-Fi', 'Thriller', 'Western'
    ]
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  posterUrl: {
    type: String,
    match: /^https?:\/\/.+\..+/
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field before saving
movieSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Text index for search
movieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', movieSchema);