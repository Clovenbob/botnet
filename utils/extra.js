import c from "./config.js";

export const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const addServer = (server) => {
  if (c.serversMatched.hasOwnProperty(server)) {
    c.serversMatched[server]++;
  } else {
    c.serversMatched[server] = 1;
  }
};
