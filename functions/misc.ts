import { Bot, Config } from "../types.ts";

export default (a: Bot, c: Config) => {
  a.logout = async () => {
    if (!a.online) return;
    a.messageQueue.splice(1);
    if (a.isLeader) a.sendMessage("/p disband");
    a.sendMessage("/status offline");
    await c.wait(c.random(1700, 4900));
    a.bot.quit();
  };

  a.leave = () => {
    a.sendMessage("/p leave");
  };

  a.promote = (user: string) => {
    a.sendMessage(`/p promote ${user}`);
  };

  a.sendInvite = (user: string) => {
    a.sendMessage(`/p ${user}`);
  };
};
