/* eslint-disable no-console */
const mongoose = require('mongoose');

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('DB connected');
    })
    .catch((err) => {
      console.log(`DB unavailable ${err}`);
      process.exit(1);
    });
};

module.exports = connectDB;
