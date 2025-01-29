const express = require("express");

const { PORT = 3001 } = process.env;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Welcome to the WTWR API!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
