require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");

const routes = require("./routes");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");

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

app.use(requestLogger);

app.use("/", routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
