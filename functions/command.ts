import { Bot, Config } from "../types.ts";

export default (a: Bot, c: Config) => {
  a.command = async (command: string, all = false) => {
    if (!a.online) return;
    switch (true) {
      case command === "logout":
        if (!all || a.isLeader) {
          a.sendMessage("/pc Logging all accounts out...");
        }
        a.logout();
        await c.wait(5000);
        process.exit();

      case command === "restart":
        if (!all || a.isLeader) {
          a.sendMessage("/pc Restarting... (a should take <15s)");
        }
        a.logout();
        break;

      case command === "limbo":
        if (!all || a.isLeader) {
          a.sendMessage("/pc Switching task to limbo...");
        }
        a.startTask("limbo");
        break;

      case command === "reward":
        if (!all || a.isLeader) {
          a.sendMessage("/pc Claiming daily reward...");
        }
        a.startTask(undefined, "reward");
        break;

      case command === "endmatch":
        if (!all || a.isLeader) {
          a.sendMessage("/pc Matching ended!");
        }
        a.startTask(undefined, "");
        a.inTask = false;
        clearTimeout(a.houseTimeout);
        break;

      case command.startsWith("home "):
        const replacement = command.replace("home ", "");
        if (!all || a.isLeader) {
          if (!replacement.includes(" "))
            a.sendMessage(`/pc Invalid format. (owner housename|number)`);
          else a.sendMessage(`/pc Switching task to home... (${replacement})`);
        }
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

        if (!all || a.isLeader)
          a.sendMessage(
            `/pc Matching ${
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
        if (c.main !== c.mainaccount.toLowerCase() && (!all || a.isLeader))
          a.sendMessage(
            `/pc Sorry, this feature is only available for ${c.mainaccount}.`
          );
        if (c.main !== c.mainaccount.toLowerCase()) return;
        a.sendMessage(command.replace("chat ", ""));
        break;

      case command.startsWith("account "):
        c.main = command.replace("account ", "");
        if (!all || a.isLeader) {
          a.sendMessage(`/pc Switched main account to ${c.main}!`);
        }
        break;

      default:
        if (!all || a.isLeader) {
          a.sendMessage("/pc Unknown command.");
        }
    }
  };
};
