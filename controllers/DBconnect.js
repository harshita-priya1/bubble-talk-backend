const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    console.log("Connecting to the database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to the database");
  } catch (error) {
    console.log(
      "Some error occured while connecting to the database :" + error
    );
  }
};

module.exports = connectDB;
