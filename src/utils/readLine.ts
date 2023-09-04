import readline from "readline";
import c from "./config.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.prompt(true);
rl.on("line", (input: string) => {
  const inputl = input.toLowerCase();
  switch (true) {
    case inputl === "help":
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

    case inputl.startsWith("account "):
      c.main = inputl.replace("account ", "");
      console.log(`Switched account to ${c.chalk.yellowBright(c.main)}!`);
      break;

    case inputl.startsWith("chatall "):
      for (let i = 0; i < c.botList.length; i++) {
        c.botList[i].sendMessage(input.replace(/chatall /i, ""));
      }
      break;
    case inputl.startsWith("chat "):
      c.botList[0].sendMessage(input.replace(/chat /i, ""));
      break;

    case inputl === "togglechat":
      c.chatEnabled = !c.chatEnabled;
      console.log(
        `Toggled chat ${
          c.chatEnabled ? c.chalk.greenBright("on") : c.chalk.redBright("off")
        }!`
      );
      break;

    case input === "reparty":
      console.log(c.chalk.greenBright("Repartying..."));
      c.botList[0].sendMessage(`/p disband`);
      c.botList[0].sendMessage(`/p leave`);
      c.botList[0].sendMessage(`/p ${c.main}`);
      for (const bot of c.botList) {
        bot.sendMessage("/p leave");
        bot.sendMessage("/status busy");
        c.botList[0].sendInvite(bot.bot.username);
      }
      break;

    case inputl === "logout":
      console.log(c.chalk.redBright("Logging all accounts out... "));
      setTimeout(() => process.exit(), 5000);
      for (let i = 0; i < c.botList.length; i++) {
        c.botList[i].bot.removeAllListeners();
        c.botList[i].logout();
      }
      break;

    case input === "kill":
      console.log(c.chalk.red("Killing process..."));
      process.exit();

    default:
      console.log(
        `${c.chalk.redBright(
          "Unknown command."
        )}\nType help for a list of commands`
      );
  }
});
