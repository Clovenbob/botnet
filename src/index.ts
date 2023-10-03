import { IAccount, ILocation } from "./types";
import getLocation from "./utils/getLocation.js";
import startBot from "./utils/startBot.js";
import accounts from "./utils/accounts.js";
import { random, wait } from "./utils/extra.js";
import c from "./utils/config.js";
import "./readLine.js";

class Account implements IAccount {
  constructor(
    firstBot: boolean,
    email: string,
    password?: string,
    session?: { accessToken?: string; clientToken?: string },
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
    this.inParty = false;
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

    startBot(this);
  }

  isLeader: boolean;
  email: string;
  password?: string;
  session?: { accessToken?: string; clientToken?: string };

  online: boolean;
  dc: boolean;

  getLocation: (message: string) => ILocation;
  location: ILocation;

  messageQueue: string[];
  isSending: boolean;
  intervalId: any;

  mainTask: string;
  subTask: string;
  inTask: boolean;
  inParty: boolean;

  slotToClick: number;
  clickItems: boolean;

  targetHouse: string;
  houseTimeout: any;
  houses: number;
  serverFails: number;

  startTask: (mainTask?: string, subTask?: string) => void;
  command: (command: string, response: number, all?: boolean) => void;
  sendMessage: (message: string, log?: boolean, time?: number) => void;
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

let isFirst = true;
for (const account of accounts) {
  c.botList.push(
    new Account(isFirst, account.username, account.password, account.session),
  );
  isFirst = false;
  await wait(random(1000, 2000));
}
