import { IAccount } from "../../types";
import utils from "../../utils/extra.js";

export default async (account: IAccount) => {
  if (!account.inTask && account.subTask === "match") {
    account.inTask = true;
    account.houses = 0;
    await account.bot.waitForTicks(utils.random(1, 20));
    account.bot.chat("/lobby housing");
    await account.bot.waitForTicks(utils.random(40, 80));
    account.nextHouse();

    return true;
  } else return false;
};
