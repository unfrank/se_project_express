const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");
const { INTERNAL_SERVER_ERROR } = require("./utils/errors");

const { PORT = 3001 } = process.env;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/wtwr_db";

if (!MONGODB_URI) {
  process.exit(1);
}

const app = express();

mongoose.connect(MONGODB_URI).catch(() => process.exit(1));

app.use(cors());
app.use(express.json());

app.use("/", routes);

app.use((err, res) => {
  res.status(err.statusCode || INTERNAL_SERVER_ERROR).send({
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT);
