import { Bot, Config } from "../types";

export default (a: Bot, c: Config) => {
  a.sendMessage = (message: string, log = false) => {
    if (!a.online) return;

    if (log) {
      if (!c.loggingEnabled) return;
      if (c.consoleEnabled) {
        console.log(`${a.bot.username}: ${chalkify(message)}`);
      }
      //discord
      //server
      if (!c.partyEnabled || !a.inParty) return;
      message = `/pc ${message}`;
    }
    if (message.match(/\/p (?:leave|disband)/) && !c.partyEnabled) return;

    const chunkSize = 250; //6 extra
    if (message.length <= chunkSize) {
      a.messageQueue.push(message);
    } else {
      for (let i = 0; i < message.length; i += chunkSize) {
        const chunk = message.substring(i, i + chunkSize + 1);
        a.messageQueue.push(`${log && i !== 0 ? "/pc " : ""}${chunk}`);
      }
    }

    if (!a.isSending) {
      a.isSending = true;
      a.intervalId = setInterval(() => {
        a.sendNextMessage();
      }, 500);
    }
  };

  a.sendNextMessage = () => {
    if (!a.online) return;

    if (a.messageQueue.length > 10) {
      a.messageQueue = [];
      console.log(
        c.chalk.red(`${a.bot.username}: Too many messages in queue.`)
      );
    }

    if (a.messageQueue.length > 0) {
      const message = a.messageQueue.shift();
      if (message) {
        a.bot.chat(message);
      }
    } else {
      clearInterval(a.intervalId);
      a.isSending = false;
    }
  };

  const chalkify = (message: string) => {
    if (message.includes("✔")) message = c.chalk.greenBright(message);
    else if (message.includes("✖")) message = c.chalk.redBright(message);
    return message;
  };
};
