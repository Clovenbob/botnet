import { IAccount } from "../../types";
import { random } from "../../utils/extra.js";

export default async (account: IAccount) => {
  if (account.mainTask === "home" && account.location["map"] !== "Base") {
    account.inTask = true;
    const space = account.targetHouse.indexOf(" ");

    if (!account.targetHouse || space === -1) {
      account.mainTask = "";
      account.targetHouse = "";
      account.inTask = false;
      return;
    }

    const owner = account.targetHouse.substring(0, space);
    const house = account.targetHouse.substring(space + 1);

    account.sendMessage("/lobby housing");
    await account.bot.waitForTicks(40);

    for (let i = 0; i < 5; i++) {
      await account.bot.waitForTicks(random(1, 100));
      if (house.match(/^[1-9]\d*$/)) {
        account.slotToClick = parseInt(house) - 1;
        account.clickItems = true;
        account.sendMessage(`/visit ${owner}`);
      } else {
        account.sendMessage(`/visit ${owner} ${house}`);
      }

      await account.bot.waitForTicks(80);

      if (account.location["map"] === "Base") break;
    }
    if (account.location["map"] !== "Base") {
      if (account.mainTask === "home") account.mainTask = "";
      account.sendMessage(
        `✖ Could not join house ${account.targetHouse}. (5 tries)`,
        true,
      );
    } else {
      account.sendMessage(`✔ Joined ${account.targetHouse}.`, true);
    }
    account.inTask = false;
    account.startTask();
    return true;
  } else return false;
};
