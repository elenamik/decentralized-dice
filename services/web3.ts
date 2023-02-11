import { ethers } from "ethers";

const INFURA_API_KEY = process.env.INFURA_API_KEY;

if (!INFURA_API_KEY) {
  console.error("process.env.INFURA_API_KEY is not defined");
  throw new Error("process.env.INFURA_API_KEY is not defined");
}

export const goerliProvider = new ethers.providers.InfuraProvider(
  "goerli",
  INFURA_API_KEY
);
