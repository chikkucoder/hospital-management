const mongoose = require("mongoose");

const connectDb = async (uri) => {
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

module.exports = { connectDb };