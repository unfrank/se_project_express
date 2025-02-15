const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
require("dotenv").config();

const { PORT = 3001 } = process.env;
const app = express();

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

mongoose
  .connect("mongodb://localhost:27017/wtwr_db", {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

app.use("/", routes);

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).send({ message: "An internal server error occurred" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
