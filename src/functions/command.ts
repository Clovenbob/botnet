import { Bot, Config } from "../types";

export default (a: Bot, c: Config) => {
  a.command = async (command: string, response: number, all = false) => {
    if (!a.online) return;

    const respond = (message: string) => {
      if (!all || a.isLeader) {
        a.sendMessage(message, true);
      }
    };

    switch (true) {
      case command.startsWith("logout"):
        respond(`Logging ${all ? "all accounts" : a.bot.username} out...`);
        a.bot.removeAllListeners();
        a.logout();

        if (!command.includes("noexit") && all) {
          await c.wait(5000);
          process.exit();
        }
        break;

      case command === "view":
        if (all) return respond("No username specified.");
        c.viewchat = a.bot.username?.toLowerCase();
        respond(`Viewing chat from ${c.viewchat}.`);
        break;

      case command === "restart":
        respond("Restarting... (this should take <15s)");
        a.logout();
        break;

      case command === "reparty":
        if (!a.isLeader) return;
        respond("Repartying...");
        a.sendMessage(`/p disband`);
        a.sendMessage(`/p leave`);
        a.sendMessage(`/p ${c.main}`);
        for (const bot of c.botList) {
          if (bot.bot.username === a.bot.username) continue;
          bot.sendMessage("/p leave");
          bot.sendMessage("/status busy");
          a.sendInvite(bot.bot.username);
        }
        break;

      case command === "limbo":
        respond("Switching task to limbo...");
        a.startTask("limbo");
        break;

      case command === "skyblock":
        respond("Switching task to skyblock...");
        a.location["server"] = "limbo";
        a.startTask("skyblock");
        break;
      case command === "reward":
        respond("Claiming daily reward...");
        a.startTask(undefined, "reward");
        break;

      case command === "endmatch":
        respond("Matching ended.");
        clearTimeout(a.houseTimeout);
        a.inTask = false;
        a.startTask(undefined, "");
        break;

      case command.startsWith("home "):
        const replacement = command.replace("home ", "");
        respond(
          replacement.includes(" ")
            ? `Switching task to home... (${replacement})`
            : "Invalid format. (owner name|number)"
        );
        if (!replacement.includes(" ")) return;
        a.targetHouse = replacement;
        a.location["map"] = "";
        a.startTask("home");
        break;

      case command.startsWith("match "):
        c.serverList = command
          .replace("match ", "")
          .toUpperCase()
          .replace("MINI", "mini")
          .split(/, |,| /);

        respond(
          `Matching ${
            c.serverList.length === 1
              ? c.serverList[0]
              : c.serverList.length === 2
              ? c.serverList.join(" and ")
              : `${c.serverList.slice(0, -1).join(", ")}, and ${
                  c.serverList[c.serverList.length - 1]
                }`
          }...`
        );
        a.startTask(undefined, "match");
        break;

      case command.startsWith("chat "):
        if (c.main !== c.mainaccount.toLowerCase() && response === 1) {
          return respond(
            `Sorry, this feature is only available for ${c.mainaccount}.`
          );
        }

        a.sendMessage(command.replace("chat ", ""));
        break;

      case command.startsWith("account "):
        c.main = command.replace("account ", "");
        respond(`Switched main account to ${c.main}!`);
        break;
    }
  };
};
