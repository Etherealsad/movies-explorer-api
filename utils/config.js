const {
  JWT_PROD_KEY = 'dev-secret', MONGO_ADRESS = 'mongodb://localhost:27017/moviesdb', NODE_ENV, PORT = 3001,
} = process.env;

module.exports = {
  JWT_PROD_KEY, MONGO_ADRESS, NODE_ENV, PORT,
};
