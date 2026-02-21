const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose
      .connect("mongodb://localhost:27017/mini_project")
      .then(() => console.log("MongoDB connected Successfully"))
      .catch((err) => console.error(err));
   
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;