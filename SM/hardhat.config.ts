import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig, vars } from "hardhat/config";

const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");
const AMOY_PRIVATE_KEY = vars.get("AMOY_PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks:{
    polygon_amoy:{
      url:`https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts:[`0x${AMOY_PRIVATE_KEY}`]
    }
  }
};

export default config;
