import { IAccount } from "../types";
import utils from "../utils/extra.js";

export default (account: IAccount) => {
  account.logout = async () => {
    if (!account.online) return;
    account.messageQueue.splice(1);
    if (account.isLeader) account.sendMessage("/p disband");
    account.sendMessage("/status offline");
    await utils.wait(utils.random(1700, 4900));
    account.bot.quit();
  };

  account.leave = () => {
    account.sendMessage("/p leave");
  };

  account.promote = (user: string) => {
    account.sendMessage(`/p promote ${user}`);
  };

  account.sendInvite = (user: string) => {
    account.sendMessage(`/p ${user}`);
  };
};
