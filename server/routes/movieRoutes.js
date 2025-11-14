import express from 'express';
import { getAllMovies, addMovie, deleteMovie, getRunningMovies, updateMovie } from '../controllers/movieController.js';
import { upload } from '../config/multer.js';

const router = express.Router();

router.get('/getMovies', getAllMovies);
router.get('/getRunningMovies', getRunningMovies);

// now accepts image under "poster"
router.post('/addMovies', upload.single('poster'), addMovie);
router.put('/updateMovies/:id', upload.single('poster'), updateMovie);

router.delete('/deleteMovies/:id', deleteMovie);

export default router;

