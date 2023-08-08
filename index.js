import getLocation from "./utils/getLocation.js";
import startBot from "./utils/startBot.js";
import accounts from "./.env/accounts.js";
import c from "./utils/config.js";
import "./utils/readLine.js";

class Bot {
  constructor(email, password, session, firstBot) {
    this.email = email;
    this.password = password;
    this.session = session;
    this.isLeader = firstBot;

    this.online = false;
    this.dc = false;

    this.getLocation = getLocation;
    this.location = {};

    this.messageQueue = [];
    this.isSending = false;
    this.intervalId;

    this.mainTask = "";
    this.subTask = "";
    this.inTask = false;

    this.slotToClick = -1;
    this.clickItems = false;

    this.targetHouse = c.targetHouse;
    this.houseTimeout;
    this.houses = 1;
    this.serverFails = 0;

    this.startBot = startBot(this, c);
  }
}

const makebots = async () => {
  for (let i = 0; i < accounts.length; i++) {
    c.botList.push(new Bot(accounts[i].username, accounts[i].password, accounts[i].session, !i ? true : false));
    await c.wait(c.random(1000, 2000));
  }
};

console.log("Welcome!\nType help for a list of commands.");
makebots();
