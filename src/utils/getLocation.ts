import { ILocation } from "../types";

export default (message: string) => {
  const keys = ["lobbyname", "gametype", "server", "map"];
  const location: ILocation = { valid: true };

  if (message.startsWith("{")) {
    try {
      const json = JSON.parse(message);

      for (const key of keys) {
        if (json[key]) {
          location[key] = json[key];
        } else if (key === "server") {
          //server is always present in valid locraw messages
          location["valid"] = false;
        }
      }
    } catch (error) {
      location["valid"] = false;
    }
  } else location["valid"] = false;

  return location;
};
