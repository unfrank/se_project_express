require("dotenv").config();
const express = require("express");

const helmet = require("helmet");
const mongoose = require("mongoose");

const cors = require("cors");
const { errors } = require("celebrate");

const routes = require("./routes");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");
const rateLimiter = require("./middlewares/rate-limiter");

const { PORT = 3001 } = process.env;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/wtwr_db";

if (!MONGODB_URI) {
  process.exit(1);
}

const app = express();

mongoose.connect(MONGODB_URI).catch(() => process.exit(1));

app.use(helmet());

app.options("*", cors());

app.use("/", routes);
// app.use(cors());

app.use(
  cors({
    origin: "https://unfrank.crabdance.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(rateLimiter);

app.use(express.json());

app.use(requestLogger);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
