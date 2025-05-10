const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const MovieController = require('../controllers/movie.controller');
const RecommendationController = require('../controllers/recommendation.controller');
const CommentController = require('../controllers/comment.controller');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/auth/register', UserController.register);
router.post('/auth/login', UserController.login);

// Protected routes
router.use(authMiddleware);

// User routes
router.get('/users/me', UserController.getProfile);

// Movie routes
router.post('/movies', MovieController.createMovie);
router.get('/movies', MovieController.getAllMovies);
router.get('/movies/:id', MovieController.getMovieWithComments);
router.put('/movies/:id', MovieController.updateMovie);
router.delete('/movies/:id', MovieController.deleteMovie);

// Recommendation routes
router.get('/users/:userId/recommendations', RecommendationController.getUserRecommendations);
router.post('/users/:userId/recommendations/generate', RecommendationController.generateRecommendations);

// Comment routes
router.post('/comments', CommentController.addComment);
router.get('/movies/:movieId/comments', CommentController.getMovieComments);

module.exports = router;