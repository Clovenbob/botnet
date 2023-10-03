import { IAccount } from "../types";
import config from "../utils/config.js";
import { random } from "../utils/extra.js";

export default (account: IAccount) => {
  account.nextHouse = async () => {
    clearTimeout(account.houseTimeout);
    if (account.subTask !== "match") return;
    await account.bot.waitForTicks(random(20, 60));
    account.houses += 1;
    account.sendMessage(
      `/home ${account.houses > 99 ? "" : "0"}${account.houses > 9 ? "" : "0"}${
        account.houses
      }`,
    );
    account.houseTimeout = setTimeout(() => {
      if (account.subTask !== "match") return;
      if (account.isLeader) {
        const serverString = Object.entries(config.serversMatched)
          .sort((a, b) => b[1] - a[1])
          .map(([server, instances]) => `${server} (x${instances})`)
          .join(", ");
        account.sendMessage(serverString, true);
      }
      account.serverFails += 1;
      if (account.serverFails >= 100) {
        account.sendMessage(
          `Server matching failed too many times! Stopping...`,
          true,
        );
        account.matched();
      } else if (account.houses === 1) {
        account.sendMessage(`No house found named 001`, true);
        account.matched();
      } else {
        account.houses = 0;
        account.sendMessage("/lobby housing");
        setTimeout(() => account.nextHouse(), random(60000, 65000));
      }
    }, 10000);
  };

  account.matched = (iMatched = false) => {
    account.subTask = "";
    account.inTask = false;
    account.serverFails = 0;
    account.startTask();
    if (!iMatched) account.sendMessage("/lobby housing");
  };
};
