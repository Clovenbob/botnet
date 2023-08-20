import { Bot, Config } from "../types.ts";

export default (a: Bot, c: Config) => {
  a.nextHouse = async () => {
    clearTimeout(a.houseTimeout);
    if (a.subTask !== "match") return;
    await a.bot.waitForTicks(c.random(20, 60));
    a.houses += 1;
    a.sendMessage(
      `/home ${a.houses > 99 ? "" : "0"}${a.houses > 9 ? "" : "0"}${a.houses}`
    );
    a.houseTimeout = setTimeout(() => {
      if (a.subTask !== "match") return;
      const serverString = Object.entries(c.serversMatched)
        .sort((a, b) => b[1] - a[1])
        .map(([server, instances]) => `${server} (x${instances})`)
        .join(", ");
      if (a.isLeader) a.sendMessage(`/pc ${serverString}`);

      a.serverFails += 1;
      if (a.serverFails >= 100) {
        a.sendMessage(`/pc Server matching failed too many times! Stopping...`);
        a.matched();
      } else if (a.houses === 1) {
        a.sendMessage(`/pc No house found named 001`);
        a.matched();
      } else {
        a.houses = 0;
        a.sendMessage("/lobby housing");
        setTimeout(() => a.nextHouse(), c.random(60000, 65000));
      }
    }, 10000);
  };

  a.matched = (iMatched = false) => {
    a.subTask = "";
    a.inTask = false;
    a.serverFails = 0;
    a.startTask();
    if (!iMatched) a.sendMessage("/lobby housing");
  };
};
