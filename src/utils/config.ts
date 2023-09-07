import { random, wait, addServer } from "./extra.js";
import { Config } from "../types";
import chalk from "chalk";
import fs from "fs";

try {
  var config = JSON.parse(fs.readFileSync("./config.json").toString());
} catch (error) {
  console.error(`Error parsing config file: ${error}`);
  process.exit(1);
}

//don't edit:
const c: Config = {
  mainaccount: config.mainaccount,
  loggingEnabled: config.loggingEnabled,
  consoleEnabled: config.consoleEnabled,
  partyEnabled: config.partyEnabled,
  discordEnabled: config.discordEnabled,
  webHookUrl: config.webHookUrl,
  serverEnabled: config.serverEnabled,
  serverUrl: config.serverUrl,
  main: config.mainaccount.toLowerCase(),
  viewchat: "",
  targetHouse: "",
  botList: [],
  serverList: [],
  serversMatched: {},
  chalk: chalk,
  addServer: addServer,
  random: random,
  wait: wait,
};

export default c;
