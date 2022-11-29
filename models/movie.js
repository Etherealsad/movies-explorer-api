const mongoose = require('mongoose');
const { isURL } = require('validator');
const { regExpYear } = require('../utils/regexp');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    minLength: 4,
    maxLength: 4,
    required: true,
    validate: {
      validator(v) {
        return regExpYear.test(v);
      },
    },
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
    },
  },
  owner: {
    type: mongoose.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
