const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const MovieController = require('../controllers/movieController');
const RecommendationController = require('../controllers/recommendationController');


// Public routes
router.post('/auth/register', UserController.register);
router.post('/auth/login', UserController.login);



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


module.exports = router;