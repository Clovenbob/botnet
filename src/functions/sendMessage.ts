import { IAccount } from "../types";
import config from "../utils/config.js";
import chalk from "chalk";

export default (account: IAccount) => {
  account.sendMessage = (message: string, log = false) => {
    if (!account.online) return;

    if (log) {
      if (!config.loggingEnabled) return;
      if (config.consoleEnabled) {
        console.log(`${account.bot.username}: ${chalkify(message)}`);
      }
      //discord
      //server
      if (!config.partyEnabled || (!account.inParty && !account.isLeader))
        return;
      message = `/pc ${message}`;
    }
    if (!config.partyEnabled && message.startsWith("/p ")) return;

    const chunkSize = 250; //6 extra
    if (message.length <= chunkSize) {
      account.messageQueue.push(message);
    } else {
      for (let i = 0; i < message.length; i += chunkSize) {
        const chunk = message.substring(i, i + chunkSize);
        account.messageQueue.push(`${log && i !== 0 ? "/pc " : ""}${chunk}`);
      }
    }

    if (!account.isSending) {
      account.isSending = true;
      account.intervalId = setInterval(() => {
        account.sendNextMessage();
      }, 500);
    }
  };

  account.sendNextMessage = () => {
    if (!account.online) return;

    if (account.messageQueue.length > 10) {
      account.messageQueue = [];
      console.log(
        chalk.red(`${account.bot.username}: Too many messages in queue.`),
      );
    }

    if (account.messageQueue.length > 0) {
      const message = account.messageQueue.shift();
      if (message) {
        account.bot.chat(message);
      }
    } else {
      clearInterval(account.intervalId);
      account.isSending = false;
    }
  };

  const chalkify = (message: string) => {
    if (message.includes("✔")) message = chalk.greenBright(message);
    else if (message.includes("✖")) message = chalk.redBright(message);
    return message;
  };
};
