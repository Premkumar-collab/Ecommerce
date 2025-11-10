// External modules
require("dotenv").config({ path: "config/config.env" });
const connectMongoDatabase = require("./config/db");
connectMongoDatabase();

const cloudinary = require("cloudinary").v2;
if (process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
}

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`[${new Date().toISOString()}] Uncaught Exception:`, err);
  process.exit(1);
});

// Local modules
const app = require("./app");
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`[${new Date().toISOString()}] Unhandled Rejection:`, err);
  server.close(() => {
    process.exit(1);
  });
});