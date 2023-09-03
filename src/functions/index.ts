import { Bot, Config } from "../types";
import command from "./command.js";
import sendMessage from "./sendMessage.js";
import task from "./task.js";
import misc from "./misc.js";
import nextHouse from "./nextHouse.js";

export default (a: Bot, c: Config) => {
  command(a, c);
  sendMessage(a, c);
  misc(a, c);
  task(a, c);
  nextHouse(a, c);
};
