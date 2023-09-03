import { Bot, Config } from "../types";

export default (a: Bot, c: Config) => {
  a.sendMessage = (message = "") => {
    if (!a.online) return;

    const chunkSize = 250; //6 extra
    const partyMessage = message?.startsWith("/pc ");

    if (message.length <= chunkSize) {
      a.messageQueue.push(message);
    } else {
      for (let i = 0; i < message.length; i += chunkSize) {
        let chunk = message.substring(i, i + chunkSize + 1);
        if (partyMessage && !chunk.startsWith("/pc ")) chunk = `/pc ${chunk}`;
        a.messageQueue.push(chunk);
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
};
