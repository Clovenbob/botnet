export default async (a, c) => {
  if (!a.inTask && a.subTask === "reward") {
    a.inTask = true;
    await a.bot.waitForTicks(1, 20);

    a.sendMessage("/lobby housing");
    await a.bot.waitForTicks(c.random(40, 80));

    a.slotToClick = 31;
    a.sendMessage("/delivery");
    await a.bot.waitForTicks(40);

    a.sendMessage("/lobby bedwars");
    await a.bot.waitForTicks(c.random(40, 80));

    a.slotToClick = 33;
    a.sendMessage("/delivery");
    await a.bot.waitForTicks(40);
    a.sendMessage("/locraw");
    a.subTask = "";
    a.inTask = false;
    a.startTask();
    return true;
  } else return false;
};
