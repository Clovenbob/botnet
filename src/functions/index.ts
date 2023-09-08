import { IAccount } from "../types";
import command from "./command.js";
import sendMessage from "./sendMessage.js";
import task from "./task.js";
import misc from "./misc.js";
import nextHouse from "./nextHouse.js";

export default (account: IAccount) => {
  command(account);
  sendMessage(account);
  misc(account);
  task(account);
  nextHouse(account);
};
