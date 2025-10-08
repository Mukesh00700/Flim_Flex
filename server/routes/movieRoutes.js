import express from 'express';
import { getAllMovies, addMovie, deleteMovie } from '../controllers/movieController.js';

const router = express.Router();

// GET /api/movies -> Fetches all movies
router.get('/getMovies', getAllMovies);

// POST /api/movies -> Adds a new movie
router.post('/addMovies', addMovie);

// DELETE /api/movies/:id -> Deletes a movie by its ID
router.delete('/deleteMovies/:id', deleteMovie);

export default router;