const Recommendation = require('../models/recommendation');
const Movie = require('../models/movie');

class RecommendationController {
    // Get recommendations for user
    static async getUserRecommendations(req, res) {
        try {
            if (req.user.userId !== req.params.userId) {
                return res.status(403).json({ error: 'Not authorized' });
            }

            const recommendations = await Recommendation.find({ userId: req.params.userId })
                .populate('movieId')
                .sort({ score: -1 });

            res.json(recommendations);
        } catch (err) {
            console.error('Get recommendations error:', err);
            res.status(500).json({ error: 'Failed to get recommendations' });
        }
    }

    // Generate recommendations for user
    static async generateRecommendations(req, res) {
        try {
            if (req.user.userId !== req.params.userId) {
                return res.status(403).json({ error: 'Not authorized' });
            }

            // Delete old recommendations
            await Recommendation.deleteMany({ userId: req.params.userId });

            // Generate new recommendations (mock implementation)
            const recommendations = await this._generateMockRecommendations(req.params.userId);

            // Save to database
            await Recommendation.insertMany(recommendations);

            // Return populated recommendations
            const populatedRecs = await Recommendation.find({ userId: req.params.userId })
                .populate('movieId');

            res.json(populatedRecs);
        } catch (err) {
            console.error('Generate recommendations error:', err);
            res.status(500).json({ error: 'Failed to generate recommendations' });
        }
    }

    // Mock recommendation algorithm
    static async _generateMockRecommendations(userId) {
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
    }
}

module.exports = RecommendationController;