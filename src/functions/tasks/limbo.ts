import { Bot, Config } from "../../types";

export default async (a: Bot, c: Config) => {
  if (a.mainTask === "limbo" && a.location["server"] !== "limbo") {
    a.inTask = true;
    await a.bot.waitForTicks(c.random(1, 20));
    a.sendMessage("/lobby housing");
    await a.bot.waitForTicks(c.random(40, 100));
    a.sendMessage("§");
    await a.bot.waitForTicks(120);
    if (a.location["server"] !== "limbo") {
      if (a.mainTask === "limbo") a.mainTask = "";
      a.sendMessage(`✖ Something went wrong trying to join limbo.`, true);
    } else {
      a.sendMessage(`✔ Entered Limbo.`, true);
    }
    a.inTask = false;
    a.startTask();
    return true;
  } else return false;
};
