import c from "./config.js";

export const wait = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const addServer = (server: string) => {
  if (c.serversMatched.hasOwnProperty(server)) {
    c.serversMatched[server]++;
  } else {
    c.serversMatched[server] = 1;
  }
};
