require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "default_secret",
};
console.log("JWT_SECRET loaded:", process.env.JWT_SECRET);
