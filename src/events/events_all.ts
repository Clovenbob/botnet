import { Bot, Config } from "../types";

export default (a: Bot, c: Config) => {
  const leader = c.botList[0];
  a.bot.on("end", async (reason: string) => {
    console.log(c.chalk.red(`${a.bot.username}: ${reason}.\nReconnecting...`));
    a.bot.removeAllListeners();
    a.online = false;
    a.inParty = false;
    await c.wait(c.random(5000, 10000));
    a.restartBot();
  });

  a.bot.on("spawn", async () => {
    if (a.online) return;
    console.log(c.chalk.greenBright(`${a.bot.username}: Spawned in`));
    await a.bot.waitForTicks(100);
    a.online = true;
    a.sendMessage("/status busy");
    if (a.isLeader) return;
    a.sendMessage("/p leave");
    await a.bot.waitForTicks(100);
    c.botList[0].sendInvite(a.bot.username);
  });

  a.bot.on("spawn", async () => {
    await a.bot.waitForTicks(40);
    a.sendMessage("/locraw");
  });

  a.bot.on("message", (json: any) => {
    if (json["extra"] && json["extra"].length === 100) return;

    const message: string = json.toString();
    const username = a.bot.username?.toLowerCase();
    const rankless = message.replace(/\[.*?\]\s*/, "").toLowerCase();

    if (message.startsWith("You are currently ")) return;
    if (message.match(/.*\/.*❤     .*\/.*✎ Mana/)) return;
    if (c.consoleEnabled && username === c.viewchat) {
      console.log(`${username}: ${json.toAnsi()}`);
    }
    if (c.main === username) {
      console.log(c.chalk.red("Main account can not be a bot's username."));
      process.exit();
    }

    if (rankless.startsWith(`from ${c.main}: party`))
      c.botList[0].sendInvite(c.main);

    if (
      rankless ===
      `${c.main} invited you to warp to their home. click here to warp`
    ) {
      a.sendMessage(json["extra"][3]["clickEvent"]["value"]);
      a.mainTask = "";
    }

    if (
      message.startsWith(
        "\nClick the link to visit our website and claim your reward:"
      )
    ) {
      a.sendMessage(message.slice(60), true);
    }

    const serverMatch = message.match(/Sending you to (.+).../);
    if (serverMatch) {
      if (a.subTask !== "match") return;
      c.addServer(serverMatch[1]);
      if (c.serverList.includes(serverMatch[1])) {
        clearTimeout(a.houseTimeout);
        a.mainTask = "home";
        a.location["map"] = "Base";
        a.targetHouse = `${a.bot.username} ${a.houses > 99 ? "" : "0"}${
          a.houses > 9 ? "" : "0"
        }${a.houses}`;
        a.sendMessage(
          `MATCHED! /visit ${a.bot.username} ${a.houses > 99 ? "" : "0"}${
            a.houses > 9 ? "" : "0"
          }${a.houses}`,
          true
        );
        a.matched(true);
        for (const bot of c.botList) {
          if (bot.bot.username !== a.bot.username) {
            bot.matched();
          }
        }
      } else {
        a.nextHouse();
      }
    }

    const regex = new RegExp(
      `^-----------------------------------------------------\\n(${leader.bot.username?.toLowerCase()}) has invited you to join`
    );

    if (regex.test(rankless)) {
      a.sendMessage(`/p accept ${leader.bot.username}`);
      a.inParty = true;
    }

    const l = a.getLocation(message);
    if (l["valid"] && l !== a.location) {
      a.location = l;
      a.startTask();
    }
  });

  a.bot.on(
    "windowOpen",
    async (window: {
      requiresConfirmation: boolean;
      slots: string | any[];
    }) => {
      if (!window) return;
      window.requiresConfirmation = false;
      if (a.slotToClick === -1) return;
      if (a.clickItems) {
        for (let i = 0; i < window.slots.length; i++) {
          if (!window.slots[i]) continue;
          if (a.slotToClick === 0) {
            await a.bot.clickWindow(i, 0, 0);
            break;
          }
          a.slotToClick--;
        }
      } else {
        await a.bot.clickWindow(a.slotToClick, 0, 0);
        a.slotToClick = -1;
      }
    }
  );

  a.bot.on("error", async (error: any) => {
    console.log(
      c.chalk.red(
        `${error} (${
          a.bot.username ? a.bot.username : a.email
        })\nReconnecting...`
      )
    );
    a.bot?.quit();
    a.bot?.removeAllListeners();
    a.online = false;
    await c.wait(c.random(5000, 10000));
    a.restartBot();
  });
};
