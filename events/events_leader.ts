import { Bot, Config } from "../types.ts";

export default (a: Bot, c: Config) => {
  a.bot.on("end", () => {
    a.dc = true;
  });

  a.bot.on("spawn", async () => {
    if (a.online) return;
    if (a.dc) for (let i = 1; i < c.botList.length; i++) c.botList[i].logout();
    a.dc = false;
    await a.bot.waitForTicks(100);
    a.sendMessage("/p leave");
    a.sendMessage(`/p ${c.main}`);
  });

  a.bot.on("message", (json: any) => {
    if (json["extra"] && json["extra"].length === 100) return;
    const message: string = json.toString();

    if (message.startsWith("You are currently ")) return;

    const rankless = message.replace(/\[.*?\]\s*/, "").toLowerCase();

    if (c.chatEnabled) console.log(json.toAnsi());

    if (
      rankless.startsWith(`party > ${c.main}: `) ||
      rankless.startsWith(`party > ${c.mainaccount.toLowerCase()}: `)
    ) {
      const command = rankless
        .replace(`party > ${c.main}: `, "")
        .replace(`party > ${c.mainaccount.toLowerCase()}: `, "");
      console.log(command);
      for (let i = 0; i < c.botList.length; i++) {
        if (command.startsWith(c.botList[i].bot.username?.toLowerCase())) {
          return c.botList[i].command(
            command.replace(`${c.botList[i].bot.username?.toLowerCase()} `, "")
          );
        }
      }

      for (let i = 0; i < c.botList.length; i++)
        c.botList[i].command(command, true);
    }
  });
};
