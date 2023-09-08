import { IAccount } from "../types";
import home from "./tasks/home.js";
import limbo from "./tasks/limbo.js";
import reward from "./tasks/reward.js";
import match from "./tasks/match.js";
import skyblock from "./tasks/skyblock.js";

export default (account: IAccount) => {
  account.startTask = async (mainTask = undefined, subTask = undefined) => {
    if (mainTask) account.mainTask = mainTask;
    if (subTask) account.subTask = subTask;
    if (!account.online) return;
    if (account.inTask) return;

    if (await reward(account)) return;
    if (await match(account)) return;
    if (await home(account)) return;
    if (await limbo(account)) return;
    if (await skyblock(account)) return;
  };
};
