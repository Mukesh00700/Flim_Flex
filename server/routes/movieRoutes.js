import express from 'express';
import { getAllMovies, addMovie, deleteMovie, getRunningMovies, updateMovie } from '../controllers/movieController.js';

const router = express.Router();


router.get('/getMovies', getAllMovies);

router.get('/getRunningMovies', getRunningMovies);

router.post('/addMovies', addMovie);

router.put('/updateMovies/:id', updateMovie);

router.delete('/deleteMovies/:id', deleteMovie);

export default router;