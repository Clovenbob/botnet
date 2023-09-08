import { IUtils } from "../types.js";
import config from "./config.js";
import chalk from "chalk";

export const wait = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const addServer = (server: string) => {
  if (config.serversMatched.hasOwnProperty(server)) {
    config.serversMatched[server]++;
  } else {
    config.serversMatched[server] = 1;
  }
};

const utils: IUtils = {
  chalk: chalk,
  addServer: addServer,
  random: random,
  wait: wait,
};

export default utils;
