import readline from "readline";
import c from "./config.js";
import send from "./sendToBots.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.prompt(true);
rl.on("line", (input: string) => {
  input = input.toLowerCase();
  switch (true) {
    case input === "help":
      console.log(
        `\n${c.chalk.blueBright("Commands")}:\n\n ${c.chalk.yellow(
          "togglechat"
        )}: Turns chat on/off.\n ${c.chalk.yellow(
          "chat (message)"
        )}: Send a message.\n ${c.chalk.yellow(
          "account (name)"
        )}: Switches the ingame command account.\n ${c.chalk.yellow(
          "logout"
        )}: Logout every account within 5 seconds.\n ${c.chalk.yellow(
          "kill"
        )}: Instantly logout every account.\n`
      );
      break;

    case input === "togglechat":
      c.chatEnabled = !c.chatEnabled;
      console.log(
        `Toggled chat ${
          c.chatEnabled ? c.chalk.greenBright("on") : c.chalk.redBright("off")
        }!`
      );
      break;
    case input === "kill":
      console.log(c.chalk.red("Killing process..."));
      process.exit();
    default:
      send(input, 0);
  }
  /*
  switch (true) {

    default:
      console.log(
        `${c.chalk.redBright(
          "Unknown command."
        )}\nType help for a list of commands`
      );
  } */
});
