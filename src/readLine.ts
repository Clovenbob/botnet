import readline from "readline";
import send from "./utils/sendToBots.js";
import config from "./utils/config.js";
import chalk from "chalk";

const rl = readline.createInterface({
  input: process.stdin,
});
rl.prompt(true);
rl.on("line", (input: string) => {
  input = input.toLowerCase();
  switch (true) {
    case input === "help":
      console.log(
        `\n${chalk.blueBright("Commands")}:\n\n ${chalk.yellow(
          "togglechat",
        )}: Turns chat on/off.\n ${chalk.yellow(
          "chat (message)",
        )}: Send a message.\n ${chalk.yellow(
          "account (name)",
        )}: Switches the ingame command account.\n ${chalk.yellow(
          "logout",
        )}: Logout every account within 5 seconds.\n ${chalk.yellow(
          "kill",
        )}: Instantly logout every account.\n`,
      );
      break;

    case input === "togglechat":
      config.consoleEnabled = !config.consoleEnabled;
      console.log(
        `Toggled chat ${
          config.consoleEnabled
            ? chalk.greenBright("on")
            : chalk.redBright("off")
        }!`,
      );
      break;
    case input === "viewnames":
      for (const current of config.botList) {
        console.log(current.bot.username);
      }
      break;
    case input === "kill":
      console.log(chalk.red("Killing process..."));
      process.exit();
    default:
      send(input, 0);
  }
  /* console.log(`${chalk.redBright("Unknown command.")}\nType help for a list of commands`); */
  rl.prompt(true);
});
