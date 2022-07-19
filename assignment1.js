const ethers = require("ethers");
const BTCUSDABI = require("./configs/BTCUSDABI.json");

const { CRONOS_MAINET, BTCUSD_ADDRESS } = require("./configs/contants.js");

const provider = new ethers.providers.JsonRpcProvider(CRONOS_MAINET);

const cronosContract = new ethers.Contract(
  BTCUSD_ADDRESS,
  BTCUSDABI.abi,
  provider
);

const getBTCUSDCPrice = async () => {
  const roundData = await cronosContract.latestRoundData();
  const decimals = await cronosContract.decimals();

  const price = roundData.answer / 10 ** decimals;
  console.log(price);

  return price;
};

getBTCUSDCPrice();
