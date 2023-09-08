import { IConfig } from "../types";
import fs from "fs";

try {
  var config = JSON.parse(fs.readFileSync("./config.json").toString());
} catch (error) {
  console.error(`Error parsing config file: ${error}`);
  process.exit(1);
}

//don't edit:
const c: IConfig = {
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
};

export default c;
