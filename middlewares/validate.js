const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { regExpYear } = require('../utils/regexp');
const BadRequestError = require('../errors/bad-request-err');
const { badRequestErrorMsg } = require('../utils/errorMessages');

const checkURL = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new BadRequestError(badRequestErrorMsg);
};

module.exports.validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().length(4).pattern(regExpYear),
    description: Joi.string().required(),
    image: Joi.string().required().custom(checkURL),
    trailer: Joi.string().required().custom(checkURL),
    thumbnail: Joi.string().required().custom(checkURL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.validateDeleteMovieByID = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex(),
  }),
});

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(35),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});
