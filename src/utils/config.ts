import { random, wait, addServer } from "./extra.js";
import { Config } from "../types";
import chalk from "chalk";

const config = {
  loggingEnabled: true, //should messages be sent in reponse to commands and actions?

  consoleEnabled: true, //should input and output go through the console?

  partyEnabled: true, //should input and output go through in game party chat?
  mainaccount: "Clovenbob", //your minecraft username

  discordEnabled: true, //should output go through discord?
  webHookUrl: "https://discord.com/api/webhooks/example", //the url of the discord webhook

  serverEnabled: true, //should messages be sent to a server?
  serverUrl: "http://localhost:3000", //the url of the server
};

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
