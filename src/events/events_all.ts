import { IAccount } from "../types";
import config from "../utils/config.js";
import { addServer, wait, random } from "../utils/extra.js";
import chalk from "chalk";

export default (account: IAccount) => {
  account.bot.on("end", async (reason) => {
    console.log(
      chalk.red(`${account.bot.username}: ${reason}.\nReconnecting...`),
    );
    account.bot.removeAllListeners();
    account.online = false;

    //if offline for 5 mins, remove from the party.
    inPartyTimeout.start();
    await wait(random(20000, 25000));
    account.restartBot();
  });

  account.bot.on("spawn", async () => {
    if (account.online) return;
    console.log(chalk.greenBright(`${account.bot.username}: Spawned in`));
    await account.bot.waitForTicks(100);
    account.online = true;
    inPartyTimeout.stop();
    account.sendMessage("/status busy");

    if (account.isLeader) return;
    account.sendMessage("/p leave");
    await account.bot.waitForTicks(100);
    config.botList[0].sendInvite(account.bot.username);
  });

  account.bot.on("spawn", async () => {
    await account.bot.waitForTicks(40);
    account.sendMessage("/locraw");
  });

  account.bot.on("message", (json) => {
    if (json["extra"] && json["extra"].length === 100) return;

    const extra: any = json["extra"];
    const message = json.toString();
    const username = account.bot.username?.toLowerCase();
    const rankless = message.replace(/\[.*?\]\s*/, "").toLowerCase();

    if (message.startsWith("You are currently ")) return;
    if (message.match(/.*\/.*❤     .*\/.*✎ Mana/)) return;
    if (config.consoleEnabled && username === config.viewchat) {
      console.log(`${account.bot.username}: ${json.toAnsi()}`);
    }
    if (config.main === username) {
      console.log(chalk.red("Main account can not be a bot's username."));
      process.exit();
    }
    if (rankless.startsWith(`from ${config.main}: party`)) {
      config.botList[0].sendInvite(config.main);
    } else if (
      rankless ===
      `${config.main} invited you to warp to their home. click here to warp`
    ) {
      account.sendMessage(extra[3]["clickEvent"]["value"]);
      account.mainTask = "";
    } else if (
      message.startsWith(
        "\nClick the link to visit our website and claim your reward:",
      )
    ) {
      account.sendMessage(message.slice(60), true);
    } else if (
      rankless.includes(
        `${config.botList[0].bot.username?.toLowerCase()} has invited you to join their party!`,
      ) &&
      rankless.startsWith("----")
    ) {
      account.sendMessage(`/p accept ${config.botList[0].bot.username}`);
      account.inParty = true;
    } else if (message.startsWith("Sending you to ")) {
      const serverMatch = message.match(/Sending you to (.+).../);
      if (serverMatch) {
        if (account.subTask !== "match") return;
        addServer(serverMatch[1]);

        if (config.serverList.includes(serverMatch[1])) {
          clearTimeout(account.houseTimeout);
          account.mainTask = "home";
          account.location["map"] = "Base";
          const houseNumber = `${account.houses > 99 ? "" : "0"}${
            account.houses > 9 ? "" : "0"
          }${account.houses}`;

          account.targetHouse = `${account.bot.username} ${houseNumber}`;
          account.sendMessage(
            `MATCHED! /visit ${account.bot.username} ${houseNumber}`,
            true,
          );
          account.matched(true);

          for (const currentAccount of config.botList) {
            if (currentAccount.bot.username !== account.bot.username) {
              currentAccount.matched();
            }
          }
        } else {
          account.nextHouse();
        }
      }
    }

    const location = account.getLocation(message);
    if (location["valid"] && location !== account.location) {
      account.location = location;
      account.startTask();
    }
  });

  account.bot.on("windowOpen", async (window) => {
    if (!window) return;
    //prevent crashing when the server doesn't send a packet back.
    window.requiresConfirmation = false;
    if (account.slotToClick === -1) return;
    if (account.clickItems) {
      //click the xth non air item
      for (let i = 0; i < window.slots.length; i++) {
        if (!window.slots[i]) continue;
        if (account.slotToClick === 0) {
          await account.bot.clickWindow(i, 0, 0);
          break;
        }
        account.slotToClick--;
      }
    } else {
      await account.bot.clickWindow(account.slotToClick, 0, 0);
      account.slotToClick = -1;
    }
  });

  account.bot.on("error", async (error) => {
    console.log(
      chalk.red(
        `${error} (${
          account.bot.username ? account.bot.username : account.email
        })\nReconnecting...`,
      ),
    );
    account.bot.quit();
    account.bot.removeAllListeners();
    account.online = false;
    await wait(random(5000, 10000));
    account.restartBot();
  });

  const inPartyTimeout: {
    start: Function;
    stop: Function;
    timeout: NodeJS.Timeout | undefined;
    active: boolean;
  } = {
    //starts the party timeout for 5 mins
    start: () => {
      if (!inPartyTimeout.active) {
        inPartyTimeout.active = true;
        inPartyTimeout.timeout = setTimeout(() => {
          account.inParty = false;
          inPartyTimeout.active = false;
        }, 5 * 60 * 1000);
      }
    },
    //stops the party timeot
    stop: () => {
      clearTimeout(inPartyTimeout.timeout);
      inPartyTimeout.active = false;
    },
    timeout: undefined,
    active: false,
  };
};
