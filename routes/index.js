const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');
const { notFoundErrorMsg } = require('../utils/errorMessages');

const auth = require('../middlewares/auth');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const authRoutes = require('./auth');

router.use('/', authRoutes);

router.use('/users', auth, usersRoutes);
router.use('/movies', auth, moviesRoutes);

router.use('*', (req, res, next) => next(new NotFoundError(notFoundErrorMsg)));

module.exports = router;
