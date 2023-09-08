import { IAccount } from "../../types";
import utils from "../../utils/extra.js";

export default async (account: IAccount) => {
  if (!account.inTask && account.subTask === "reward") {
    account.inTask = true;
    await account.bot.waitForTicks(utils.random(1, 20));

    account.sendMessage("/lobby housing");
    await account.bot.waitForTicks(utils.random(40, 80));

    account.slotToClick = 31;
    account.sendMessage("/delivery");
    await account.bot.waitForTicks(40);

    account.sendMessage("/lobby bedwars");
    await account.bot.waitForTicks(utils.random(40, 80));

    account.slotToClick = 33;
    account.sendMessage("/delivery");
    await account.bot.waitForTicks(40);
    account.sendMessage("/locraw");
    account.subTask = "";
    account.inTask = false;
    account.startTask();
    return true;
  } else return false;
};
