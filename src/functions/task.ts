import { Bot, Config } from "../types";
import home from "./tasks/home.js";
import limbo from "./tasks/limbo.js";
import reward from "./tasks/reward.js";
import match from "./tasks/match.js";
import skyblock from "./tasks/skyblock.js";

export default (a: Bot, c: Config) => {
  a.startTask = async (mainTask = undefined, subTask = undefined) => {
    if (mainTask) a.mainTask = mainTask;
    if (subTask) a.subTask = subTask;
    if (!a.online) return;
    if (a.inTask) return;

    if (await reward(a, c)) return;
    if (await match(a, c)) return;
    if (await home(a, c)) return;
    if (await limbo(a, c)) return;
    if (await skyblock(a, c)) return;
  };
};
