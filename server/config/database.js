const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = () => {
  console.log('Attempting DB connection...');

  mongoose
    .connect(process.env.DATABASE_URL, {})
    .then(() => {
      console.log('DB is connected successfully');
    })
    .catch((error) => {
      console.log('DB connection failed:', error.message);
      console.log('DB full error:', error);
    });
};

module.exports = dbConnect;