const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");

const { INTERNAL_SERVER_ERROR } = require("./utils/errors");

const { PORT = 3001, MONGODB_URI } = process.env;

const app = express();

mongoose
  .connect(MONGODB_URI, {})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

app.use("/", routes);

app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(INTERNAL_SERVER_ERROR).send({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at ${PORT}`);
});
