const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");

const { INTERNAL_SERVER_ERROR } = require("./utils/errors");

const { PORT = 3001, MONGODB_URI } = process.env;

const app = express();

// ✅ Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit if DB fails
  });

app.use(cors());
app.use(express.json());

// ✅ Debugging: Log all incoming requests
app.use((req, res, next) => {
  console.log(`🟡 ${req.method} ${req.url}`);
  next();
});

// ✅ Mount all routes
app.use("/", routes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(INTERNAL_SERVER_ERROR).send({ message: "Internal Server Error" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});
