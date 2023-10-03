import { IAccount } from "../types";
import { wait, random } from "../utils/extra.js";

export default (account: IAccount) => {
  account.logout = async () => {
    if (!account.online) return;
    account.messageQueue.splice(1);
    if (account.isLeader) account.sendMessage("/p disband");
    account.sendMessage("/status offline");
    await wait(random(1700, 4900));
    account.bot.quit();
  };

  account.leave = () => {
    account.sendMessage("/p leave");
  };

  account.promote = (user) => {
    account.sendMessage(`/p promote ${user}`);
  };

  account.sendInvite = (user) => {
    account.sendMessage(`/p ${user}`);
  };
};
