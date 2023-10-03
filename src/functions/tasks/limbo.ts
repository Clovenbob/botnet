import { IAccount } from "../../types";
import { random } from "../../utils/extra.js";

export default async (account: IAccount) => {
  if (account.mainTask === "limbo" && account.location["server"] !== "limbo") {
    account.inTask = true;
    await account.bot.waitForTicks(random(1, 20));
    account.sendMessage("/lobby housing");
    await account.bot.waitForTicks(random(40, 100));
    account.sendMessage("§");
    await account.bot.waitForTicks(120);
    if (account.location["server"] !== "limbo") {
      if (account.mainTask === "limbo") account.mainTask = "";
      account.sendMessage(`✖ Something went wrong trying to join limbo.`, true);
    } else {
      account.sendMessage(`✔ Entered Limbo.`, true);
    }
    account.inTask = false;
    account.startTask();
    return true;
  } else return false;
};
