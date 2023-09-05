import { Bot, Config } from "../../types";

export default async (a: Bot, c: Config) => {
  if (a.mainTask === "home" && a.location["map"] !== "Base") {
    a.inTask = true;
    const space = a.targetHouse.indexOf(" ");

    if (!a.targetHouse || space === -1) {
      a.mainTask = "";
      a.targetHouse = "";
      a.inTask = false;
      return;
    }

    const owner = a.targetHouse.substring(0, space);
    const house = a.targetHouse.substring(space + 1);

    a.sendMessage("/lobby housing");
    await a.bot.waitForTicks(40);

    for (let i = 0; i < 5; i++) {
      await a.bot.waitForTicks(c.random(1, 100));
      if (house.match(/^[1-9]\d*$/)) {
        a.slotToClick = parseInt(house) - 1;
        a.clickItems = true;
        a.sendMessage(`/visit ${owner}`);
      } else {
        a.sendMessage(`/visit ${owner} ${house}`);
      }

      await a.bot.waitForTicks(80);

      if (a.location["map"] === "Base") break;
    }
    if (a.location["map"] !== "Base") {
      if (a.mainTask === "home") a.mainTask = "";
      a.sendMessage(`✖ Could not join house ${a.targetHouse}. (5 tries)`, true);
    } else {
      a.sendMessage(`✔ Joined ${a.targetHouse}.`, true);
    }
    a.inTask = false;
    a.startTask();
    return true;
  } else return false;
};
