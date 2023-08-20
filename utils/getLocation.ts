import { Location } from "../types.ts";

export default (message: string) => {
  const keys = ["lobbyname", "gametype", "server", "map"];
  const location: Location = { valid: true };

  if (message.startsWith("{")) {
    const json = JSON.parse(message);

    for (const key of keys) {
      if (json[key]) {
        location[key] = json[key];
      } else if (key === "server") {
        location["valid"] = false;
      }
    }
  } else location["valid"] = false;

  return location;
};
