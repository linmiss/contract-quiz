const ethers = require("ethers");
const { default: axios } = require("axios");

const { abi } = require("./configs/weatherABI.json");
const { CRONOS_TEST_RPC, WEATHER_ADDRESS } = require("./configs/contants.js");
const { privateKey } = require("./configs/private.json");

const WEATHER_URL = "https://goweather.herokuapp.com/weather";
const CITY_NAMES = {
  sh: "shanghai",
  hk: "hongkong",
  ld: "London",
};

const BATCH_ID = Math.floor(new Date("2022-07-19").getTime() / 1000);

const provider = new ethers.providers.JsonRpcProvider(CRONOS_TEST_RPC);
const wallet = new ethers.Wallet(privateKey, provider);
const signer = wallet.connect(provider);

const weatherContract = new ethers.Contract(WEATHER_ADDRESS, abi, signer);

const formatTemp = (temp) => Number(temp.split(" ")[0]);

const writeTempContract = async (cityName, temp) => {
  const data = await weatherContract.reportWeather(
    BATCH_ID,
    ethers.utils.formatBytes32String(cityName),
    formatTemp(temp)
  );

  return data;
};

const reportWeather = async () => {
  const [
    {
      data: { temperature: shanghaiTemp },
    },
    {
      data: { temperature: hongkongTemp },
    },
    {
      data: { temperature: londonTemp },
    },
  ] = await Promise.all([
    axios.get(`${WEATHER_URL}/${CITY_NAMES.sh}`),
    axios.get(`${WEATHER_URL}/${CITY_NAMES.hk}`),
    axios.get(`${WEATHER_URL}/${CITY_NAMES.ld}`),
  ]);

  const shResponse = await writeTempContract(CITY_NAMES.sh, shanghaiTemp);
  const hkResponse = await writeTempContract(CITY_NAMES.hk, hongkongTemp);
  const ldResponse = await writeTempContract(CITY_NAMES.ld, londonTemp);

  console.log(shResponse);
  console.log(hkResponse);
  console.log(ldResponse);
};

const getWeather = async (cityName) => {
  const temp = await weatherContract.getWeather(
    BATCH_ID,
    ethers.utils.formatBytes32String(cityName)
  );
  console.log(temp);
  return temp;
};

reportWeather();
getWeather(CITY_NAMES.hk);
