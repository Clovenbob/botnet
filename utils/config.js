import { random, wait, addServer } from "./extra.js";
import chalk from "chalk";

export default {
  //--------------------------
  mainaccount: "Clovenbob",
  chatEnabled: true,
  //--------------------------

  //Don't edit:
  main: this.mainaccount.toLowerCase(),
  targetHouse: "",
  botList: [],
  serverList: [],
  serversMatched: {},
  chalk: chalk,
  addServer: addServer,
  random: random,
  wait: wait,
};
