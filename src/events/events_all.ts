import { IAccount } from "../types";
import config from "../utils/config.js";
import utils from "../utils/extra.js";

export default (account: IAccount) => {
  const leader = config.botList[0];

  account.bot.on("end", async (reason: string) => {
    console.log(
      utils.chalk.red(`${account.bot.username}: ${reason}.\nReconnecting...`)
    );
    account.bot.removeAllListeners();
    account.online = false;

    //if offline for 5 mins, remove from the party.
    inPartyTimeout.start();
    await utils.wait(utils.random(5000, 10000));
    account.restartBot();
  });

  account.bot.on("spawn", async () => {
    if (account.online) return;
    console.log(utils.chalk.greenBright(`${account.bot.username}: Spawned in`));
    await account.bot.waitForTicks(100);
    account.online = true;
    inPartyTimeout.stop();
    account.sendMessage("/status busy");

    //if not leader, leave the party,
    if (account.isLeader) return;
    account.sendMessage("/p leave");
    await account.bot.waitForTicks(100);
    config.botList[0].sendInvite(account.bot.username);
  });

  account.bot.on("spawn", async () => {
    await account.bot.waitForTicks(40);
    //send get location message to server
    account.sendMessage("/locraw");
  });

  account.bot.on("message", (json: any) => {
    if (json["extra"] && json["extra"].length === 100) return;

    const message: string = json.toString();
    const username = account.bot.username?.toLowerCase();
    //remove ranks and make string lowercase
    const rankless = message.replace(/\[.*?\]\s*/, "").toLowerCase();

    //remove spam messages
    if (message.startsWith("You are currently ")) return;
    if (message.match(/.*\/.*❤     .*\/.*✎ Mana/)) return;
    //if viewing chat, log the colored message
    if (config.consoleEnabled && username === config.viewchat) {
      console.log(`${username}: ${json.toAnsi()}`);
    }
    //exit the program if the main account is a bots username (prevent infinite loop)
    if (config.main === username) {
      console.log(utils.chalk.red("Main account can not be a bot's username."));
      process.exit();
    }
    //if the main account sends a message asking to party, party them.
    if (rankless.startsWith(`from ${config.main}: party`))
      config.botList[0].sendInvite(config.main);
    //accept housing invites from the main account
    if (
      rankless ===
      `${config.main} invited you to warp to their home. click here to warp`
    ) {
      account.sendMessage(json["extra"][3]["clickEvent"]["value"]);
      account.mainTask = "";
    }
    //log daily reward
    if (
      message.startsWith(
        "\nClick the link to visit our website and claim your reward:"
      )
    ) {
      account.sendMessage(message.slice(60), true);
    }

    const serverMatch = message.match(/Sending you to (.+).../);
    if (serverMatch) {
      if (account.subTask !== "match") return;
      //adds the server to the matched list
      utils.addServer(serverMatch[1]);
      if (config.serverList.includes(serverMatch[1])) {
        clearTimeout(account.houseTimeout);
        account.mainTask = "home";
        account.location["map"] = "Base";
        account.targetHouse = `${account.bot.username} ${
          account.houses > 99 ? "" : "0"
        }${account.houses > 9 ? "" : "0"}${account.houses}`;
        account.sendMessage(
          `MATCHED! /visit ${account.bot.username} ${
            account.houses > 99 ? "" : "0"
          }${account.houses > 9 ? "" : "0"}${account.houses}`,
          true
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
    //accept party invites from the leader bot

    if (
      rankless.startsWith(
        `-----------------------------------------------------\\n(${leader.bot.username?.toLowerCase()}) has invited you to join`
      )
    ) {
      account.sendMessage(`/p accept ${leader.bot.username}`);
      account.inParty = true;
    }
    //update the bot's location
    const l = account.getLocation(message);
    if (l["valid"] && l !== account.location) {
      account.location = l;
      account.startTask();
    }
  });

  account.bot.on(
    "windowOpen",
    async (window: {
      requiresConfirmation: boolean;
      slots: string | any[];
    }) => {
      if (!window) return;
      //fix erros
      window.requiresConfirmation = false;
      //if not clicking items, return;
      if (account.slotToClick === -1) return;
      if (account.clickItems) {
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
    }
  );
  //on error, reconnect
  account.bot.on("error", async (error: any) => {
    console.log(
      utils.chalk.red(
        `${error} (${
          account.bot.username ? account.bot.username : account.email
        })\nReconnecting...`
      )
    );
    account.bot?.quit();
    account.bot?.removeAllListeners();
    account.online = false;
    await utils.wait(utils.random(5000, 10000));
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
