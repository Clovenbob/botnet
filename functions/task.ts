import { Bot, Config } from "../types.ts";

import home from "./tasks/home.ts";
import limbo from "./tasks/limbo.ts";
import reward from "./tasks/reward.ts";
import match from "./tasks/match.ts";

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
  };
};
