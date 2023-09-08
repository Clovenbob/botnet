import config from "./config.js";

export default (input: string, response: number) => {
  for (const bot of config.botList) {
    const username = bot.bot.username?.toLowerCase();
    if (input.startsWith(username)) {
      return bot.command(input.replace(`${username} `, ""), response);
    }
  }
  for (const bot of config.botList) {
    bot.command(input, response, true);
  }
};
