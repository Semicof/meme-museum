// config.js
require("dotenv").config();
const fs = require("fs");

const abi = JSON.parse(fs.readFileSync("./abis/MemeMuseumABI.json", "utf8"));

module.exports = {
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  ABI: abi,
  NETWORK_URL: `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
};
