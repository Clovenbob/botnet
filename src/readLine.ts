import readline from "readline";
import send from "./utils/sendToBots.js";
import config from "./utils/config.js";
import utils from "./utils/extra.js";

const rl = readline.createInterface({
  input: process.stdin,
});
rl.prompt(true);
rl.on("line", (input: string) => {
  input = input.toLowerCase();
  switch (true) {
    case input === "help":
      console.log(
        `\n${utils.chalk.blueBright("Commands")}:\n\n ${utils.chalk.yellow(
          "togglechat"
        )}: Turns chat on/off.\n ${utils.chalk.yellow(
          "chat (message)"
        )}: Send a message.\n ${utils.chalk.yellow(
          "account (name)"
        )}: Switches the ingame command account.\n ${utils.chalk.yellow(
          "logout"
        )}: Logout every account within 5 seconds.\n ${utils.chalk.yellow(
          "kill"
        )}: Instantly logout every account.\n`
      );
      break;

    case input === "togglechat":
      config.consoleEnabled = !config.consoleEnabled;
      console.log(
        `Toggled chat ${
          config.consoleEnabled
            ? utils.chalk.greenBright("on")
            : utils.chalk.redBright("off")
        }!`
      );
      break;
    case input === "viewnames":
      for (const current of config.botList) {
        console.log(current.bot.username);
      }
      break;
    case input === "kill":
      console.log(utils.chalk.red("Killing process..."));
      process.exit();
    default:
      send(input, 0);
  }
  /* console.log(`${utils.chalk.redBright("Unknown command.")}\nType help for a list of commands`); */
});
