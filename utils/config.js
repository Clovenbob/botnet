import { random, wait, addServer } from "./extra.js";
import chalk from "chalk";

const config = {
  mainaccount: "Clovenbob",
  chatEnabled: true,
};

//don't edit:
export default {
  mainaccount: config.mainaccount,
  chatEnabled: config.chatEnabled,
  main: config.mainaccount.toLowerCase(),
  targetHouse: "",
  botList: [],
  serverList: [],
  serversMatched: {},
  chalk: chalk,
  addServer: addServer,
  random: random,
  wait: wait,
};
