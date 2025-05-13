const Movie = require('../../models/movie');

module.exports = {
  Query: {
    getMovie: async (_, { id }) => {
      return await Movie.findById(id);
    },

    getAllMovies: async (_, { sortBy, limit, offset }) => {
      const sort = sortBy ? { [sortBy]: 1 } : {};
      return await Movie.find().sort(sort).limit(limit || 0).skip(offset || 0);
    },

    searchMovies: async (_, { query }) => {
      return await Movie.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { director: { $regex: query, $options: 'i' } },
        ]
      });
    },
  },

  Mutation: {
    createMovie: async (_, { input }) => {
      const movie = new Movie(input);
      return await movie.save();
    },

    updateMovie: async (_, { id, input }) => {
      return await Movie.findByIdAndUpdate(id, input, { new: true, runValidators: true });
    },

    deleteMovie: async (_, { id }) => {
      const movie = await Movie.findByIdAndDelete(id);
      return !!movie;
    }
  }
};
