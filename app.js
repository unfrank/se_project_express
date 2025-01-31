const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://localhost:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

app.use((req, res, next) => {
  req.user = { _id: "650ffb6de59b1c001b47c9f2" };
  next();
});

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
