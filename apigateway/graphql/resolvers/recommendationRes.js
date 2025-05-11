const Recommendation = require('../../models/recommendation');
const Movie = require('../../models/movie');
const { AuthenticationError } = require('apollo-server-express');

// Mock recommendation engine (replace with real implementation)
const generateRecommendations = async (userId) => {
  // In a real app, this would use ML algorithms
  const popularMovies = await Movie.find()
    .sort({ averageRating: -1 })
    .limit(5)
    .lean();

  return popularMovies.map((movie, index) => ({
    userId,
    movieId: movie._id,
    score: 0.9 - (index * 0.1), // Fake score
    reason: 'popular',
    algorithmVersion: 'v1.0'
  }));
};

module.exports = {
  Query: {
    getUserRecommendations: async (_, { userId }, { currentUserId }) => {
      if (currentUserId !== userId) {
        throw new AuthenticationError('Not authorized');
      }
      
      try {
        return await Recommendation.find({ userId })
          .sort({ score: -1 })
          .populate('movieId');
      } catch (err) {
        throw new Error('Failed to fetch recommendations');
      }
    },
    getMovieRecommendations: async (_, { movieId }) => {
      try {
        // This could be "similar movies" logic
        const movie = await Movie.findById(movieId);
        return await Movie.find({ genre: movie.genre })
          .limit(5)
          .sort({ averageRating: -1 });
      } catch (err) {
        throw new Error('Failed to fetch similar movies');
      }
    }
  },
  Mutation: {
    generateRecommendations: async (_, { userId }, { currentUserId }) => {
      if (currentUserId !== userId) {
        throw new AuthenticationError('Not authorized');
      }
      
      try {
        // Delete old recommendations
        await Recommendation.deleteMany({ userId });
        
        // Generate new ones
        const recommendations = await generateRecommendations(userId);
        
        // Save to database
        await Recommendation.insertMany(recommendations);
        
        return await Recommendation.find({ userId }).populate('movieId');
      } catch (err) {
        throw new Error('Failed to generate recommendations');
      }
    }
  },
  Recommendation: {
    movie: async (parent) => {
      try {
        return await Movie.findById(parent.movieId);
      } catch (err) {
        throw new Error('Failed to fetch recommended movie');
      }
    },
    user: async (parent, _, { loaders }) => {
      return loaders.user.load(parent.userId);
    }
  }
};