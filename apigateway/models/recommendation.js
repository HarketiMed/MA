const mongoose = require('mongoose');
const { Schema } = mongoose;

const recommendationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
    index: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  reason: {
    type: String,
    enum: [
      'similar_users',
      'genre_preference',
      'director_preference',
      'popular',
      'trending',
      'recently_added'
    ],
    required: true
  },
  algorithmVersion: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for faster lookups
recommendationSchema.index({ userId: 1, score: -1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);