import { Bot, Config } from "../types.ts";
import command from "./command.ts";
import sendMessage from "./sendMessage.ts";
import task from "./task.ts";
import misc from "./misc.ts";
import nextHouse from "./nextHouse.ts";

export default (a: Bot, c: Config) => {
  command(a, c);
  sendMessage(a, c);
  misc(a, c);
  task(a, c);
  nextHouse(a, c);
};
