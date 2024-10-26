const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const MarketPlaceModule = buildModule("MarketPlaceModule", (m) => {
  const MarketPlace = m.contract("MarketPlace");

  return { MarketPlace };
});

module.exports = MarketPlaceModule;