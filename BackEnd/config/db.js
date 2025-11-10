const mongoose = require("mongoose");
const url = process.env.MONGO_URL;

const connectMongoDatabase = () => {
  mongoose
    .connect(url)
    .then(() => {
      console.log("Succefully connected to MongoDB");
    })
};

module.exports = connectMongoDatabase;