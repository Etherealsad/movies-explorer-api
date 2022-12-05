const router = require('express').Router();
const { getMovies, createMovie, deleteMovieByID } = require('../controllers/movies');
const { validateCreateMovie, validateDeleteMovieByID } = require('../middlewares/validate');

router.get('/', getMovies);

router.post('/', validateCreateMovie, createMovie);

router.delete('/:movieId', validateDeleteMovieByID, deleteMovieByID);

module.exports = router;
