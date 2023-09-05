import { Bot, Location } from "./types";
import getLocation from "./utils/getLocation.js";
import startBot from "./utils/startBot.js";
import accounts from "./utils/accounts.js";
import c from "./utils/config.js";
import "./readLine.js";

class createBot implements Bot {
  constructor(
    firstBot: boolean,
    email: string,
    password?: string,
    session?: { accessToken?: string; clientToken?: string }
  ) {
    this.isLeader = firstBot;
    this.email = email;
    this.password = password;
    this.session = session;

    this.online = false;
    this.dc = false;

    this.getLocation = getLocation;
    this.location = { valid: false };

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

    this.sendNextMessage = () => {};
    this.sendMessage = () => {};
    this.restartBot = () => {};
    this.sendInvite = () => {};
    this.nextHouse = () => {};
    this.startTask = () => {};
    this.command = () => {};
    this.matched = () => {};
    this.promote = () => {};
    this.logout = () => {};
    this.leave = () => {};

    this.bot;
    startBot(this, c);
  }

  isLeader: boolean;
  email: string;
  password?: string;
  session?: { accessToken?: string; clientToken?: string };

  online: boolean;
  dc: boolean;

  getLocation: (message: string) => Location;
  location: Location;

  messageQueue: string[];
  isSending: boolean;
  intervalId: any;

  mainTask: string;
  subTask: string;
  inTask: boolean;

  slotToClick: number;
  clickItems: boolean;

  targetHouse: string;
  houseTimeout: any;
  houses: number;
  serverFails: number;

  startTask: (mainTask?: string, subTask?: string) => void;
  command: (command: string, response: number, all?: boolean) => void;
  sendMessage: (message?: string, log?: boolean) => void;
  matched: (iMatched?: boolean) => void;
  sendInvite: (user: string) => void;
  promote: (user: string) => void;
  sendNextMessage: () => void;
  restartBot: () => void;
  nextHouse: () => void;
  logout: () => void;
  leave: () => void;

  bot: any;
}

console.log("Welcome!\nType help for a list of commands.");

for (let i = 0; i < accounts.length; i++) {
  c.botList.push(
    new createBot(
      !i ? true : false,
      accounts[i].username,
      accounts[i].password,
      accounts[i].session
    )
  );
  await c.wait(c.random(1000, 2000));
}
