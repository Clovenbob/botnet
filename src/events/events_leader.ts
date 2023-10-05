import { IAccount } from "../types";
import config from "../utils/config.js";
import send from "../utils/sendToBots.js";

export default (account: IAccount) => {
  account.bot.on("end", () => {
    account.dc = true;
  });

  account.bot.on("spawn", async () => {
    if (account.online) return;
    if (account.dc) {
      for (let i = 1; i < config.botList.length; i++) {
        config.botList[i].logout();
      }
    }
    account.dc = false;
    config.viewchat = account.bot.username?.toLowerCase();
    await account.bot.waitForTicks(100);
    account.sendMessage("/p leave");
    account.sendMessage(`/p ${config.main}`);
  });

  account.bot.on("message", (json) => {
    if (json["extra"] && json["extra"].length === 100) return;
    const message: string = json.toString();

    const rankless = message.replace(/\[.*?\]\s*/, "").toLowerCase();

    if (
      rankless.startsWith(`party > ${config.main}: `) ||
      rankless.startsWith(`party > ${config.mainaccount.toLowerCase()}: `)
    ) {
      const command = rankless
        .replace(`party > ${config.main}: `, "")
        .replace(`party > ${config.mainaccount.toLowerCase()}: `, "");
      send(command, 1);
    }
  });
};
