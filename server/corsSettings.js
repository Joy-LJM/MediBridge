const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });
//allow requests from target server based on env
const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? "https://medi-bridge-1.vercel.app"
    : "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow common methods
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigin); // Allow frontend
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allow common HTTP methods
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow necessary headers
  res.header("Access-Control-Allow-Credentials", "true"); // Allow cookies
  next();
});
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204); // No content response for preflight
});
