import mineflayer from "mineflayer";
import botFunctions from "../functions/index.js";
import botEvents from "../events/events_all.js";
import leaderEvents from "../events/events_leader.js";
import { IAccount } from "../types";

export default (account: IAccount) => {
  account.restartBot = () => {
    if (account.session) {
      account.bot = mineflayer.createBot({
        username: account.email,
        session: account.session,
        auth: "microsoft",
        host: "mc.hypixel.net",
        version: "1.8.9",
        chatLengthLimit: 256,
        hideErrors: true,
      });
    } else {
      account.bot = mineflayer.createBot({
        username: account.email,
        password: account.password,
        auth: "microsoft",
        host: "mc.hypixel.net",
        version: "1.8.9",
        chatLengthLimit: 256,
        hideErrors: true,
      });
    }
    botFunctions(account);
    botEvents(account);
    if (account.isLeader) leaderEvents(account);
  };
  account.restartBot();
};
