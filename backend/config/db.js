const mongoose = require("mongoose");

async function connectDb(uri) {
  return mongoose.connect(uri);
}

module.exports = { connectDb };
