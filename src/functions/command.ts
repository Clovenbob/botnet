import { IAccount } from "../types";
import config from "../utils/config.js";
import { wait } from "../utils/extra.js";

export default (account: IAccount) => {
  account.command = async (command: string, response: number, all = false) => {
    if (!account.online) return;

    const respond = (message: string) => {
      if (!all || account.isLeader) {
        account.sendMessage(message, true);
      }
    };

    switch (true) {
      case command.startsWith("logout"):
        respond(
          `Logging ${all ? "all accounts" : account.bot.username} out...`,
        );
        account.bot.removeAllListeners();
        account.logout();

        if (!command.includes("noexit") && all) {
          await wait(5000);
          process.exit();
        }
        break;

      case command === "view":
        if (all) return respond("No username specified.");
        config.viewchat = account.bot.username?.toLowerCase();
        respond(`Viewing chat from ${config.viewchat}.`);
        break;

      case command === "restart":
        respond("Restarting... (this should take <15s)");
        account.logout();
        break;

      case command === "reparty":
        if (!account.isLeader) return;
        if (config.partyEnabled) respond("Repartying...");
        account.sendMessage(`/p disband`);
        account.sendMessage(`/p leave`);
        account.sendMessage(`/p ${config.main}`);
        for (const current of config.botList) {
          if (current.bot.username === account.bot.username) continue;
          current.sendMessage("/p leave");
          current.sendMessage("/status busy");
          account.sendInvite(current.bot.username);
        }
        break;

      case command === "limbo":
        respond("Switching task to limbo...");
        account.startTask("limbo");
        break;

      case command === "skyblock":
        respond("Switching task to skyblock...");
        account.location["server"] = "limbo";
        account.startTask("skyblock");
        break;
      case command === "reward":
        respond("Claiming daily reward...");
        account.startTask(undefined, "reward");
        break;

      case command === "endmatch":
        respond("Matching ended.");
        clearTimeout(account.houseTimeout);
        account.inTask = false;
        account.startTask(undefined, "");
        break;

      case command.startsWith("home "):
        const replacement = command.replace("home ", "");
        respond(
          replacement.includes(" ")
            ? `Switching task to home... (${replacement})`
            : "Invalid format. (owner name|number)",
        );
        if (!replacement.includes(" ")) return;
        account.targetHouse = replacement;
        account.location["map"] = "";
        account.startTask("home");
        break;

      case command.startsWith("match "):
        config.serverList = command
          .replace("match ", "")
          .toUpperCase()
          .replace("MINI", "mini")
          .split(/, |,| /);

        respond(
          `Matching ${
            config.serverList.length === 1
              ? config.serverList[0]
              : config.serverList.length === 2
              ? config.serverList.join(" and ")
              : `${config.serverList.slice(0, -1).join(", ")}, and ${
                  config.serverList[config.serverList.length - 1]
                }`
          }...`,
        );
        account.startTask(undefined, "match");
        break;

      case command.startsWith("chat "):
        if (
          config.main !== config.mainaccount.toLowerCase() &&
          response === 1
        ) {
          return respond(
            `Sorry, this feature is only available for ${config.mainaccount}.`,
          );
        }

        account.sendMessage(command.replace("chat ", ""));
        break;

      case command.startsWith("account "):
        config.main = command.replace("account ", "");
        respond(`Switched main account to ${config.main}!`);
        break;
    }
  };
};
