import mineflayer from "mineflayer";
import botFunctions from "../functions/index.ts";
import botEvents from "../events/events_all.ts";
import leaderEvents from "../events/events_leader.ts";
import { Bot, Config } from "../types.ts";

export default (a: Bot, c: Config) => {
  a.restartBot = () => {
    if (a.session) {
      a.bot = mineflayer.createBot({
        username: a.email,
        //session: a.session, not working atm :(
        auth: "microsoft",
        host: "mc.hypixel.net",
        version: "1.8.9",
        chatLengthLimit: 256,
        hideErrors: true,
      });
    } else {
      a.bot = mineflayer.createBot({
        username: a.email,
        password: a.password,
        auth: "microsoft",
        host: "mc.hypixel.net",
        version: "1.8.9",
        chatLengthLimit: 256,
        hideErrors: true,
      });
    }
    botFunctions(a, c);
    botEvents(a, c);
    if (a.isLeader) leaderEvents(a, c);
  };
  a.restartBot();
};
