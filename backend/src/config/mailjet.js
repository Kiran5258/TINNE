const dotenv = require("dotenv");
dotenv.config(); 

const mailjet = require("node-mailjet").apiConnect(
  process.env.MJ_API_KEY,
  process.env.MJ_API_SECRET
);

module.exports = mailjet;
