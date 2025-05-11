const Movie = require('../schemas/movieSchema');
const grpcService = require('../../services/grpcservice');
const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Query: {
    getMovie: async (_, { id }) => {
      try {
        return await Movie.findById(id);
      } catch (err) {
        throw new Error('Failed to fetch movie');
      }
    },
    getAllMovies: async () => {
      try {
        return await Movie.find().sort({ createdAt: -1 });
      } catch (err) {
        throw new Error('Failed to fetch movies');
      }
    },
    searchMovies: async (_, { title }) => {
      try {
        return await Movie.find(
          { $text: { $search: title } },
          { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } });
      } catch (err) {
        throw new Error('Search failed');
      }
    }
  },
  Mutation: {
    createMovie: async (_, { input }, { userId, isAdmin }) => {
      
      
      try {
        const movie = new Movie(input);
        return await movie.save();
      } catch (err) {
        throw new Error('Failed to create movie');
      }
    },
    updateMovie: async (_, { id, input }, { userId, isAdmin }) => {
      
      
      try {
        return await Movie.findByIdAndUpdate(
          id,
          { $set: input },
          { new: true }
        );
      } catch (err) {
        throw new Error('Failed to update movie');
      }
    },
    deleteMovie: async (_, { id }, { userId, isAdmin }) => {
      
      
      try {
        await Movie.findByIdAndDelete(id);
        return true;
      } catch (err) {
        throw new Error('Failed to delete movie');
      }
    }
  },
  Movie: {
    comments: async (parent) => {
      try {
        const comments = await grpcService.getMovieComments(parent._id.toString());
        return comments.map(comment => ({
          ...comment,
          createdAt: new Date(comment.createdAt).toISOString()
        }));
      } catch (err) {
        console.error('Error fetching comments:', err);
        return [];
      }
    },
    averageRating: async (parent) => {
      // This could be enhanced with actual rating logic
      return parent.averageRating || 0;
    }
  }
};