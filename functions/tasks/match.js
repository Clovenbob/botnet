export default async (a, c) => {
  if (!a.inTask && a.subTask === "match") {
    a.inTask = true;
    a.houses = 0;
    await a.bot.waitForTicks(c.random(1, 20));
    a.bot.chat("/lobby housing");
    await a.bot.waitForTicks(c.random(40, 80));
    a.nextHouse();

    return true;
  } else return false;
};
