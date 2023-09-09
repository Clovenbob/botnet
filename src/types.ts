import mineflayer from "mineflayer";
import chalk from "chalk";

export interface IAccount {
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
  sendMessage: (message: string, log?: boolean) => void;
  matched: (iMatched?: boolean) => void;
  sendInvite: (user: string) => void;
  promote: (user: string) => void;
  sendNextMessage: () => void;
  restartBot: () => void;
  nextHouse: () => void;
  logout: () => void;
  leave: () => void;

  bot: mineflayer.Bot;
}

export interface IConfig {
  mainaccount: string;
  loggingEnabled: boolean;
  consoleEnabled: boolean;
  partyEnabled: boolean;
  discordEnabled: boolean;
  webHookUrl: string;
  serverEnabled: boolean;
  serverUrl: string;
  main: string;
  viewchat: string;
  targetHouse: string;

  botList: IAccount[];
  serverList: string[];
  serversMatched: { [server: string]: number };
}

export interface IUtils {
  chalk: typeof chalk;
  addServer: (server: string) => void;
  random: (min: number, max: number) => number;
  wait: (ms: number) => Promise<void>;
}

export interface IAccounts {
  username: string;
  password?: string;
  session?: { accessToken?: string; clientToken?: string };
}

export interface ILocation {
  valid: boolean;
  [key: string]: string | boolean;
}
