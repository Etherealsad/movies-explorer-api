const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const {
  badRequestErrorMsg, usersWrongEmailOrPasswordMsg, usersNotFoundErrorMsg, usersConflictErrorMsg,
} = require('../utils/errorMessages');
const { NODE_ENV, JWT_PROD_KEY } = require('../utils/config');

const { JWT_SECRET } = process.env;

module.exports.getMyInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(badRequestErrorMsg));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(new NotFoundError(usersNotFoundErrorMsg))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(badRequestErrorMsg));
      } else if (err.codeName === 'DuplicateKey') {
        next(new ConflictError(usersConflictErrorMsg));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  User.findOne({ email }).then((usr) => {
    if (usr) {
      throw new ConflictError(usersConflictErrorMsg);
    }
    bcrypt.hash(password, 10)
      .then((hash) => User.create({ email, password: hash, name }))
      .then((user) => {
        res.send({ _id: user._id, email: user.email, name: user.name });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError(badRequestErrorMsg));
        } else {
          next(err);
        }
      });
  }).catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(new UnauthorizedError(usersWrongEmailOrPasswordMsg))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new UnauthorizedError(usersWrongEmailOrPasswordMsg));
          } else {
            const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_PROD_KEY, { expiresIn: '7d' });
            res.status(201).send({ token });
          }
        });
    })
    .catch(next);
};
