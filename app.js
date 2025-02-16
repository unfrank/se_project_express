const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
require("dotenv").config();

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://localhost:27017/wtwr_db", {})
  .then(() => {})
  .catch(() => {});

app.use(cors());
app.use(express.json());

app.use("/", routes);

app.use((err, req, res) => {
  res.status(500).send({ message: "An internal server error occurred" });
});

app.listen(PORT, () => {});
