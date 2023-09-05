import { Bot, Config } from "../../types";

export default async (a: Bot, c: Config) => {
  if (a.mainTask === "skyblock" && a.location["gametype"] !== "SKYBLOCK") {
    a.inTask = true;
    await a.bot.waitForTicks(c.random(1, 20));
    if (a.location["server"] === "limbo") {
      a.sendMessage("/l");
      await a.bot.waitForTicks(c.random(40, 100));
    }
    a.sendMessage("/play sb");
    await a.bot.waitForTicks(120);
    if (a.location["gametype"] !== "SKYBLOCK") {
      a.sendMessage(`✖ Something went wrong trying to join Skyblock.`, true);
    } else {
      a.sendMessage(`✔ Entered Skyblock.`, true);
    }
    a.inTask = false;
    a.startTask();
    return true;
  } else return false;
};
