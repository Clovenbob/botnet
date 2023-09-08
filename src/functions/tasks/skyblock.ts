import { IAccount } from "../../types";
import utils from "../../utils/extra.js";

export default async (account: IAccount) => {
  if (
    account.mainTask === "skyblock" &&
    account.location["gametype"] !== "SKYBLOCK"
  ) {
    account.inTask = true;

    for (let i = 0; i < 5; i++) {
      await account.bot.waitForTicks(utils.random(1, 20));

      if (account.location["server"] === "limbo") {
        account.sendMessage("/l");
        await account.bot.waitForTicks(utils.random(40, 100));
      }

      account.sendMessage("/play sb");
      await account.bot.waitForTicks(120);

      if (account.location["gametype"] === "SKYBLOCK") break;
    }
    if (account.location["gametype"] !== "SKYBLOCK") {
      account.sendMessage(
        `✖ Something went wrong trying to join Skyblock. (5 tries)`,
        true
      );
    } else {
      account.sendMessage(`✔ Entered Skyblock.`, true);
    }
    account.inTask = false;
    account.startTask();
    return true;
  } else return false;
};
