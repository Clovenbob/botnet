export default (a, c) => {
  a.bot.on("end", () => {
    a.dc = true;
  });

  a.bot.once("spawn", async () => {
    if (a.dc) for (let i = 1; i < c.botList.length; i++) c.botList[i].logout();
    a.dc = false;
    await a.bot.waitForTicks(100);
    a.sendMessage("/p leave");
    a.sendMessage(`/p ${c.main}`);
    console.log(c.chalk.greenBright(`${a.bot.username}: Spawned in`));
  });

  a.bot.on("message", (json) => {
    if (json["extra"] && json["extra"].length === 100) return;
    const message = json.toString();

    if (message.startsWith("You are currently ")) return;

    const rankless = message.replace(/\[.*?\]\s*/, "").toLowerCase();

    if (c.chatEnabled) console.log(message);

    //if (rankless === `${c.main} joined the party.`) a.sendMessage(`/p transfer ${c.main}`); Need leader perms for /p disband

    if (rankless.startsWith(`party > ${c.main}: `) || rankless.startsWith(`party > ${c.mainaccount.toLowerCase()}: `)) {
      const command = rankless.replace(`party > ${c.main}: `, "").replace(`party > ${c.mainaccount.toLowerCase()}: `, "");
      console.log(command);
      for (let i = 0; i < c.botList.length; i++) {
        if (command.startsWith(c.botList[i].bot.username?.toLowerCase())) {
          return c.botList[i].command(command.replace(`${c.botList[i].bot.username?.toLowerCase()} `, ""));
        }
      }

      for (let i = 0; i < c.botList.length; i++) c.botList[i].command(command, true);
    }
  });
};
