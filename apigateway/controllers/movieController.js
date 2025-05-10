const Movie = require('../models/movie.model');
const grpcService = require('../services/grpc.service');

class MovieController {
    // Create a new movie (Admin only)
    static async createMovie(req, res) {
        try {
            if (!req.user.isAdmin) {
                return res.status(403).json({ error: 'Admin access required' });
            }

            const { title, description, releaseYear, director, genre, duration, posterUrl } = req.body;
            
            // Validate input
            if (!title || !description || !releaseYear || !director || !genre || !duration) {
                return res.status(400).json({ error: 'Required fields are missing' });
            }

            const movie = new Movie({
                title,
                description,
                releaseYear,
                director,
                genre,
                duration,
                posterUrl
            });

            const savedMovie = await movie.save();
            res.status(201).json(savedMovie);
        } catch (err) {
            console.error('Create movie error:', err);
            res.status(500).json({ error: 'Failed to create movie' });
        }
    }

    // Get all movies
    static async getAllMovies(req, res) {
        try {
            const { limit = 10, offset = 0, search } = req.query;
            
            let query = {};
            if (search) {
                query = { $text: { $search: search } };
            }

            const movies = await Movie.find(query)
                .skip(parseInt(offset))
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });

            res.json(movies);
        } catch (err) {
            console.error('Get movies error:', err);
            res.status(500).json({ error: 'Failed to fetch movies' });
        }
    }

    // Get movie by ID with comments
    static async getMovieWithComments(req, res) {
        try {
            const movie = await Movie.findById(req.params.id);
            if (!movie) {
                return res.status(404).json({ error: 'Movie not found' });
            }

            // Get comments from Comments microservice via gRPC
            const comments = await grpcService.getMovieComments(req.params.id);

            res.json({
                ...movie.toObject(),
                comments
            });
        } catch (err) {
            console.error('Get movie error:', err);
            res.status(500).json({ error: 'Failed to fetch movie' });
        }
    }

    // Update movie (Admin only)
    static async updateMovie(req, res) {
        try {
            if (!req.user.isAdmin) {
                return res.status(403).json({ error: 'Admin access required' });
            }

            const updatedMovie = await Movie.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            if (!updatedMovie) {
                return res.status(404).json({ error: 'Movie not found' });
            }

            res.json(updatedMovie);
        } catch (err) {
            console.error('Update movie error:', err);
            res.status(500).json({ error: 'Failed to update movie' });
        }
    }

    // Delete movie (Admin only)
    static async deleteMovie(req, res) {
        try {
            if (!req.user.isAdmin) {
                return res.status(403).json({ error: 'Admin access required' });
            }

            const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
            if (!deletedMovie) {
                return res.status(404).json({ error: 'Movie not found' });
            }

            res.json({ success: true });
        } catch (err) {
            console.error('Delete movie error:', err);
            res.status(500).json({ error: 'Failed to delete movie' });
        }
    }
}

module.exports = MovieController;