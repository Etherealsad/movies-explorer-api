require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');

const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./utils/limiter');
const router = require('./routes/index');

const { MONGO_ADRESS, PORT } = require('./utils/config');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_ADRESS, {
  // useUnifiedTopology: true,
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.use(cors);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
