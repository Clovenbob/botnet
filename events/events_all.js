export default (a, c) => {
  a.bot.on("end", async (reason) => {
    a.online = false;
    console.log(c.chalk.red(`${a.bot.username}: ${reason}`));
    await c.wait(c.random(5000, 10000));
    a.startBot();
  });

  a.bot.once("spawn", async () => {
    await a.bot.waitForTicks(100);
    a.online = true;
    a.sendMessage("/status busy");
    if (a.isLeader) return;
    a.sendMessage("/p leave");
    await a.bot.waitForTicks(100);
    c.botList[0].sendInvite(a.bot.username);
    console.log(c.chalk.greenBright(`${a.bot.username}: Spawned in`));
  });

  a.bot.on("spawn", async () => {
    await a.bot.waitForTicks(40);
    a.sendMessage("/locraw");
  });

  a.bot.on("message", (json) => {
    if (json["extra"] && json["extra"].length === 100) return;

    const message = json.toString();
    const rankless = message.replace(/\[.*?\]\s*/, "").toLowerCase();

    if (c.main === a.bot.username.toLowerCase()) {
      console.log(c.chalk.red("Main account can not be a bot's username."));
      process.exit();
    }

    if (rankless.startsWith(`from ${c.main}: party`)) c.botList[0].sendInvite(c.main);

    if (rankless === `${c.main} invited you to warp to their home. click here to warp`) {
      a.sendMessage(json["extra"][3]["clickEvent"]["value"]);
      a.mainTask = "";
    }

    if (message.startsWith("\nClick the link to visit our website and claim your reward:")) {
      a.sendMessage(`/pc ${message.slice(60)}`);
    }

    const serverMatch = message.match(/Sending you to (.+).../);
    if (serverMatch) {
      if (a.subTask !== "match") return;
      c.addServer(serverMatch[1]);
      if (c.serverList.includes(serverMatch[1])) {
        clearTimeout(a.houseTimeout);
        a.mainTask = "home";
        a.location["map"] = "Base";
        a.targetHouse = `${a.bot.username} ${a.houses > 99 ? "" : "0"}${a.houses > 9 ? "" : "0"}${a.houses}`;
        a.sendMessage(`/pc MATCHED! /visit ${a.bot.username} ${a.houses > 99 ? "" : "0"}${a.houses > 9 ? "" : "0"}${a.houses}`);
        a.matched(true);
        for (let i = 0; i < c.botList.length; i++) {
          if (c.botList[i].bot.username !== a.bot.username) c.botList[i].matched();
        }
      } else {
        a.nextHouse();
      }
    }

    const regex = new RegExp(
      `^-----------------------------------------------------\\n(${c.botList[0].bot.username?.toLowerCase()}) has invited you to join`
    );

    if (regex.test(rankless)) {
      a.sendMessage(`/p accept ${c.botList[0].bot.username}`);
    }

    const l = a.getLocation(message);
    if (l["valid"] && l !== a.location) {
      a.location = l;
      a.startTask();
    }
  });

  a.bot.on("windowOpen", async (window) => {
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
  });

  a.bot.on("error", async (error) => {
    if (error.code === "ECONNREFUSED") {
      console.log(`${a.bot.username}: Failed to connect to ${error.address}:${error.port}`);
    } else {
      console.log(`${a.username}: Error: ${error.code}`);
      a.bot.quit();
      await wait(c.random(5000, 10000));
      a.startBot();
    }
  });
};
